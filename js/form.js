function FormField(element, options) {}
FormField.prototype.invalidate = function(errorMessage) {};
FormField.prototype.validate = function() {};
FormField.prototype.dynamicValidate = function() {};

function Form(form, options) {

	var that = this;

	this.fields = {};
	this.isValid = true;

	forEach(form.elements, function (element) {
		var fieldEl, name;

		if (element.name) {
			fieldEl = UI.closest(element, '.ui.field');
			if (!fieldEl) {
				fieldEl = UI.createElement('div.ui.field');
				element.parentElement.insertBefore(fieldEl, element);
				fieldEl.appendChild(element);
			}

			name = element.name.replace(/\[\]$/, '').replace(/\[([^\]]+)\]/g, '_$1');
			that.fields[name] = new FormField(fieldEl);
		}
	});

	form.addEventListener('submit', function (e) {
		if ('onSubmit' in that) {
			if (!that.onsubmit()) {
				e.preventDefault();
			}
		} else if ('onDynamicSubmit' in that) {
			UI.ajax({
				method: 'post',
				data: that.getValues(),
				success: function (response) {
					if (response.errors) {
						that.invalidateFields(response.errors);
					} else {
						that.onDynamicSubmit(response);
					}
				}
			});
		}
	});

}
Form.prototype.invalidateFields = function (errors, validateTheRest) {
	var key;

	for (key in this.fields) {
		if (key in errors) {
			this.fields[key].invalidate(errors[key]);
		} else if (validateTheRest) {
			this.fields[key].validate(errors[key]);
		}
	}
};
Form.prototype.getValues = function () {
	var key, value, values = {};

	for (key in this.fields) {
		value = this.fields[key].getValue();
		if (value) {
			values[key] = value;
		}
	}
};
Form.prototype.validate = function () {
	var key;

	this.isValid = true;

	for (key in this.fields) {
		this.fields[key].dynamicValidate();
		this.isValid = this.isValid && this.fields[key].isValid;
	}
};