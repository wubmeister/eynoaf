function FormField(element) {
    this.element = element;
}
FormField.prototype.invalidate = function (message) {
    var errorHint, input;
    var textInputTypes = [ "email", "number", "password", "search", "tel", "text", "url" ];

    input = this.element.querySelector('input,textarea');

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

    if (input.tagName.toLowerCase == 'textarea' || textInputTypes.indexOf(input.type) > -1) {
        input.classList.add('error');
    }
};
FormField.prototype.validate = function () {
    var errorHint, input;
    var textInputTypes = [ "email", "number", "password", "search", "tel", "text", "url" ];

    input = this.element.querySelector('input,textarea');
    errorHint = this.element.querySelector('.error.hint');

    if (errorHint) {
        errorHint.style.display = 'none';
    }

    if (input.tagName.toLowerCase == 'textarea' || textInputTypes.indexOf(input.type) > -1) {
        input.classList.add('error');
    }
};