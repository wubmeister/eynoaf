function Uploader(form, activeButton) {
	this.fields = {};

	if (form) {
		this.parseForm(form, activeButton);
	}
}
Uploader.prototype.parseForm = function (form, activeButton) {
	var i, element, j;

	for (i = 0; i < form.elements.length; i++) {
		element = form.elements[i];
		if (element.name) {
			if (element.nodeName == 'SELECT') {
				if (element.selectedIndex > -1) {
					this.set(element.name, element.options[element.selectedIndex].value);
				}
			} else if (element.type == 'radio' || element.type == 'checkbox') {
				if (element.checked && element.value) {
					this.set(element.name, element.value);
				}
			} else if (element.type == 'file') {
				for (j = 0; j < element.files.length; j++) {
					this.set(element.name, element.files[j]);
				}
			} else if (element.nodeName == 'BUTTON' || element.type == 'submit') {
				if (activeButton == element) {
					this.set(element.name, element.value);
				}
			} else if (element.value) {
				this.set(element.name, element.value);
			}
		}
	}
};
Uploader.prototype.set = function(fieldName, value) {
	var key = fieldName.replace(/\[\]$/, ''),
		isArray = fieldName.length > key.length;

	if (value instanceof File) {
		if (!('MAX_FILE_SIZE' in this.fields)) {
			this.set('MAX_FILE_SIZE', '3M');
		}
	}

	if (fieldName == 'MAX_FILE_SIZE') {
		var m = value.match(/^(\d+)(g|m|k)?/i),
			size = m ? parseInt(m[1]) : 0,
			multiply = 1;

		if (m && m.length > 2 && m[2]) {
			switch (m[2].toLowerCase()) {
				case 'g':
					multiply = 1024*1024*1024;
					break;

				case 'm':
					multiply = 1024*1024;
					break;

				case 'k':
					multiply = 1024;
					break;
			}
		}

		value = size * multiply;
	}

	if (isArray) {
		if (fieldName in this.fields) {
			this.fields[fieldName] = [this.fields[fieldName]];
		} else {
			this.fields[fieldName] = [];
		}
		this.fields[fieldName].push(value);
	} else {
		this.fields[fieldName] = value;
	}
};
Uploader.prototype.ajax = function (url, data, headers) {
	var uploader = this;

	var promise = new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest(),
			key, response;

		xhr.onreadystatechange = function () {
			if (this.readyState == 4) {
				if (this.status == 200) {
					response = this.responseText;
					if (response[0] == '{' || response[0] == '[') {
						response = JSON.parse(this.responseText) || this.responseText;
					}
					this.parsedResponse = response;
					resolve(this);
				} else {
					reject(this.statusText);
				}
			}
		}

		xhr.upload.onprogress = function (e) {
			uploader.onprogress(e.loaded / e.total);
		}

		xhr.open('POST', url, true);

		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		for (key in headers) {
			xhr.setRequestHeader(key, headers[key]);
		}

		xhr.send(data);
	});

	return promise;
};
Uploader.prototype.send = function (url, form) {
	var boundary,
		headers = {},
		footer,
		parts = [],
		fields = this.fields,
		promise,
		uploader = this;

	if (form) {
		this.parseForm(form);
	}

	function prepareMFD() {
		boundary = '---------------------------' + (new Date()).getTime();

		headers['Content-Type'] = 'multipart/form-data; boundary=' + boundary;
		footer = '--' + boundary + "--\r\n";
	}

	function makeBlob(parts) {
		var bb;

		if (('BlobBuilder' in window) || ('MSBlobBuilder' in window)) {
			bb = ('MSBlobBuilder' in window) ? new MSBlobBuilder() : new BlobBuilder();
			parts.forEach(function (part) {
				bb.append(part);
			});
			return bb.getBlob();
		}

		return new Blob(parts);
	}

	function encodeField(name, value) {
		var head = '--' + boundary + "\r\n" + 'Content-Disposition: form-data; name="' + name  + '"',
			tail = "\r\n";

		if (value instanceof Array) {

			value.forEach(function (val) {
				encodeField(name, val);
			});

		} else {

			if (typeof value == 'object') {
				head += '; filename="' + value.name + '"' + "\r\n" + 'Content-Type: ' + value.type;
			}
			head += "\r\n\r\n";

			parts.push(makeBlob([ head, value, tail ]));

		}
	}

	function collectFields() {
		var key;

		for (key in fields) {
			encodeField(key, fields[key]);
		}

		parts.push(footer);

		return new Blob(parts);
	}

	prepareMFD();
	collectFields();

	return this.ajax(url, new Blob(parts), headers);
};
Uploader.prototype.onprogress = function(phase) {};