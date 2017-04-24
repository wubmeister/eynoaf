var FormValidators = {
    alphanum: function (value, options) {
        var isValid = options && options.allowWhitespace ? /^[a-z0-9\s]+$/i.test(value) : /^[a-z0-9]+$/i.test(value);
        if (!isValid) {
            return "'" + value + "' is not alphanumeric";
        }
        return true;
    },
    alpha: function (value, options) {
        var isValid = options && options.allowWhitespace ? /^[a-z\s]+$/i.test(value) : /^[a-z]+$/i.test(value);
        if (!isValid) {
            return "The value may contain only letters" + (options && options.allowWhitespace ? " and whitespaces" : "");
        }
        return true;
    },
    between: function (value, options) {
        var isValid = value >= options.min && value <= options.max;
        if (!isValid) {
            return "The value must lie between '" + options.min + "' and '" + options.max + "'";
        }
        return true;
    },
    // date
    //     - format
    //     - locale
    digits: function (value, options) {
        var isValid = options && options.allowWhitespace ? /^[0-9\s]+$/i.test(value) : /^[0-9]+$/i.test(value);
        if (!isValid) {
            return "The value may contain only digits" + (options && options.allowWhitespace ? " and whitespaces" : "");
        }
        return true;
    },
    email: function (value, options) {
        var isValid = /^[^@\s]+@([^\.\s]+\.)+[a-z]{2,10}$/i.test(value);
        if (!isValid) {
            return "'" + value + "' is not a valid e-mail address";
        }
        return true;
    },
    float: function (value, options) {
        var isValid = /^([0-9]*\.)?[0-9]+$/i.test(value);
        if (!isValid) {
            return "'" + value + "' is not a valid floating point value";
        }
        return true;
    },
    greaterThan: function (value, matchAgainst) {
        var isValid = value > matchAgainst;
        if (!isValid) {
            return "The value should be greater than " + matchAgainst;
        }
        return true;
    },
    hex: function (value, options) {
        var isValid = /^[0-9a-f]+$/i.test(value);
        if (!isValid) {
            return "'" + value + "' is not a valid hexadecimal value";
        }
        return true;
    },
    hostname: function (value, options) {
        var isValid = /^([a-z0-9\-_]+\.)+[a-z]{2,10}$/i.test(value);
        if (!isValid) {
            if (options.allowIp) {
                isValid = this.ip(value);
            }
            return "'" + value + "' is not a valid hostname";
        }
        return true;
    },
    iban: function (value, options) {
        var isValid = false, m, check, checkSum, checkString, checkDigits, i;
        m = value.match(/^([A-Z]{2})(\d{2})([A-Z0-9\s]{11,30})/);
        if (m) {
            checkDigits = '';
            checkString = m[3] + m[1];
            for (i = 0; i < checkString.length; m++) {
                checkDigits += (/\d/.test(checkString[i]) ? checkString : parseInt(checkString, 36));
            }
            checkSum = parseInt(checkDigits) % 97;
            isValid = checkSum == parseInt(m[2]);
        }
        if (!isValid) {
            return "'" + value + "' is not a valid IBAN number";
        }
        return true;
    },
    identical: function (value, matchAgainst) {
        var isValid = value == matchAgainst;
        if (!isValid) {
            return "The value should be '" + matchAgainst + "'";
        }
        return true;
    },
    inArray: function (value, options) {
        var isValid = options.indexOf(value) > -1;
        if (!isValid) {
            return "The value should be '" + options.slice(0,-1).join("', '") + "'' or '" + options[options.length-1] + "'";
        }
        return true;
    },
    int: function (value) {
        var isValid = this.digits(value);
        if (!isValid) {
            return "'" + value + "' is not a valid integer value";
        }
        return true;
    },
    int: function (value) {
        var isValid = false, m;
        m = value.match(/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/);
        if (m) {
            isValid = parseInt(m[1]) <= 255 && parseInt(m[2]) <= 255 && parseInt(m[3]) <= 255 && parseInt(m[4]) <= 255;
        }
        if (!isValid) {
            return "'" + value + "' is not a valid IP address";
        }
        return true;
    },
    // isbn
    lessThan: function (value, matchAgainst) {
        var isValid = value < matchAgainst;
        if (!isValid) {
            return "The value should be less than " + matchAgainst;
        }
        return true;
    },
    notEmpty: function (value) {
        var isValid = value.length > 0;
        if (!isValid) {
            return "The value cannot be empty";
        }
        return true;
    },
    regex: function (value, matchAgainst) {
        var isValid = matchAgainst.test(value);
        if (!isValid) {
            return "'" + value + "' is invalid";
        }
        return true;
    },
    stringLength: function (value, options) {
        var isValid = true;

        if (options.min) {
            isValid = isValid && value.length >= options.min;
        }
        if (options.max) {
            isValid = isValid && value.length <= options.max;
        }

        if (!isValid) {
            return "The value must be"
                + (options.min ? " at least " + options.min + (options.max ? " and" : "") : "")
                + (options.max ? " at most " + options.max : "") + " characters long";
        }
        return true;
    }
};

function FormField(element) {
    this.element = element;
    this.input = this.element.querySelector('input,textarea');
}
FormField.prototype.invalidate = function (message) {
    var errorHint;
    var textInputTypes = [ "email", "number", "password", "search", "tel", "text", "url" ];

    if (message) {
        errorHint = this.element.querySelector('.error.hint');

        if (!errorHint) {
            errorHint = document.createElement('div');
            errorHint.className = 'error hint';
            this.element.appendChild(errorHint);
        }

        errorHint.innerHTML = message;
        errorHint.style.display = 'block';
    }

    if (this.input.tagName.toLowerCase() == 'textarea' || textInputTypes.indexOf(this.input.type) > -1) {
        this.input.classList.add('error');
    }
};
FormField.prototype.validate = function () {
    var errorHint;
    var textInputTypes = [ "email", "number", "password", "search", "tel", "text", "url" ];

    errorHint = this.element.querySelector('.error.hint');

    if (errorHint) {
        errorHint.style.display = 'none';
    }

    if (this.input.tagName.toLowerCase() == 'textarea' || textInputTypes.indexOf(this.input.type) > -1) {
        this.input.classList.remove('error');
    }
};
FormField.prototype.buildValidators = function() {
    var valSpec;

    valSpec = this.input.getAttribute('data-validate');

    if (valSpec) {
        this.validators = eval('(function(){return '+valSpec+';})();');
    }
};
FormField.prototype.dynamicValidate = function() {
    var value, isValid, result, ff;

    value = this.getValue();
    isValid = true;
    ff = this;

    if (!this.validators) {
        this.buildValidators();
    }

    if (this.validators) {
        forEach(this.validators, function (validator, name) {
            if (name in FormValidators) {
                result = FormValidators[name](value, validator === true ? {} : validator);
                if (result !== true) {
                    ff.invalidate(result);
                    isValid = false;
                }
            }
        });

        if (isValid) {
            this.validate();
        }
    }
};
FormField.prototype.getValue = function () {
    var value = null;

    // TODO: Valu for multicheckbox
    if (this.input.tagName.toLowerCase() == 'textarea') {
        value = this.input.selectedIndex > -1 ? this.input.options[this.input.selectedIndex] : null;
    } else if (this.input.type == 'checkbox' || this.input.type == 'radio') {
        value = this.input.checked ? this.input.value : null;
    } else {
        value = this.input.value;
    }

    return value ? value.replace(/^\s+|\s+$/g, '') : '';
};

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
        var data;

		if ('onSubmit' in that) {
            e.preventDefault();
			if (that.onSubmit() !== true) {
				//e.preventDefault();
			}
		} else if ('onDynamicSubmit' in that) {
            e.preventDefault();

			UI.ajax({
                url: form.action,
				method: 'post',
				data: that.getValues(),
				success: function (response) {
					if (response.errors) {
						that.invalidateFields(response.errors, true);
					} else {
                        that.invalidateFields({}, true);
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
			this.fields[key].validate();
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

    return values;
};
Form.prototype.validate = function () {
	var key;

	this.isValid = true;

	for (key in this.fields) {
		this.fields[key].dynamicValidate();
		this.isValid = this.isValid && this.fields[key].isValid;
	}
};