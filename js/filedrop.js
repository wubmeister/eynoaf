function FileDrop(element, options) {

	var files, fileDrop, inner, postTo, form, inputName;

	options = UI.collectOptions(options || {}, element, {
		uploadOnDrop: false
	});

	files = [];

	inputName = element.name.replace(/\[\]$/, '') + '[]';

	fileDrop = document.createElement('div');
	fileDrop.className = 'ui filedrop';
	inner = document.createElement('div');
	inner.className = 'inner';

	element.parentElement.insertBefore(fileDrop, element);
	fileDrop.appendChild(element);
	fileDrop.appendChild(inner);

	(function () {
		var label, fdLabel;

		fdLabel = document.createElement('div');
		fdLabel.className = 'label';

		if (element.id) {
			label = document.querySelector('label[for="' + element.id + '"]');
		}
		if (label) {
			fdLabel.innerHTML = label.innerHTML;
			label.parentElement.removeChild(label);
		} else {
			fdLabel.innerHTML = 'Drop files here to upload';
		}
		fileDrop.appendChild(fdLabel);
	})();

	form = element;
	while (form && form.nodeName != 'FORM') {
		form = form.parentElement;
	}

	if (form) {
		postTo = form.getAttribute('action');
	} else {
		postTo = location.toString();
	}

	function generateImagePreview(file, preview) {
		var reader, image;

		reader = new FileReader();
		image = new Image();
		reader.onload = function () {
			preview.innerHTML = '';
			preview.appendChild(image);
			image.src = this.result;
		};
		reader.readAsDataURL(file);
	}

	function generatePreview(file, preview) {
		var iconType = selectIconByMimeType(file.type, file.name);

		preview.innerHTML = '<span class="' + iconType + ' fileicon"></span>';

		if (file.type.match(/^image\//)) {
			generateImagePreview(file, preview);
		}
	}

	function generateItem(file) {
		var el, preview;

		el = document.createElement('div');
		el.className = 'item';
		el.innerHTML = '<div class="preview"><div class="inner"></div>' +
			(options.uploadOnDrop ? '<div class="ui bottom attached primary progress"><div class="bar" style="width:0;"></div></div>' : '') +
			'<div class="actions"><a class="ui white circle outline button" data-delete style="font-size: 24px;" title="Delete"><i class="material-icons">delete</i></a></div></div>' +
			'<div class="title">' + file.name + '</div>';

		inner.appendChild(el);

		preview = el.querySelector('.preview .inner');
		generatePreview(file, preview);

		return el;
	}

	function uploadFile(file, progressBar) {
		var uploader = new Uploader();
		uploader.set(inputName, file);
		uploader.onprogress = function (phase) {
			progressBar.querySelector('.bar').style.width = (100 * phase) + '%';

			if (phase >= 1) {
				progressBar.className = progressBar.className.replace(/\b(primary|secondary|info|success|warning|danger)\b/, 'success');
			}
		};
		uploader.send(postTo);
	}

	function removeFile(file, item) {
		var index = files.indexOf(file);

		if (index > -1) {
			files.splice(index, 1);
		}
		item.parentElement.removeChild(item);
	}

	function injectFiles(newFiles) {
		forEach(newFiles, function(file) {
			var item = generateItem(file);
			if (options.uploadOnDrop) {
				uploadFile(file, item.querySelector('.preview .ui.progress'));
			} else {
				item.fileDropFile = file;
				files.push(file);
			}
		});
	}

	function dummyListener(e) {
		e.preventDefault();
	}

	forEach([ 'drag', 'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'dragstart' ], function (event) {
		fileDrop.addEventListener(event, dummyListener);
	});

	fileDrop.addEventListener('drop', function (e) {
		e.preventDefault();
		injectFiles(e.dataTransfer.files);
	});

	fileDrop.addEventListener('click', function (e) {
		var el, url, method, match;

		e.preventDefault();

		el = e.target;
		while (el && el != fileDrop && !el.hasAttribute('data-delete')) {
			el = el.parentElement;
		}

		if (el && el != fileDrop) {
			while (el && el != fileDrop && !el.classList.contains('item')) {
				el = el.parentElement;
			}
			if (el && el != fileDrop) {
				if (('fileDropFile' in el) && !options.uploadOnDrop) {
					removeFile(el.fileDropFile, el);
				} else {
					url = el.getAttribute('data-delete-action');

					if (url && confirm('Are you sure you want to delete this file?')) {
						if (url && (match = url.match(/^(DELETE|GET|POST|PUT):/))) {
							method = match[1];
							url = url.substr(match[0].length);
						} else {
							method = 'DELETE';
						}

						UI.ajax({
							url: url,
							method: method,
							success: function (response) {
								el.parentElement.removeChild(el);
							},
							error: function () {
								alert('Something went wrong with deleting the file');
							}
						});
					}
				}
			}
		} else {
			element.dispatchEvent(new MouseEvent('click'));
		}
	});

	element.addEventListener('change', function (e) {
		injectFiles(this.files);
		this.value = '';
	});

	if (!options.uploadOnDrop) {
		form.addEventListener('submit', function (e) {
			var uploader, form;

			e.preventDefault();

			form = this;
			uploader = new Uploader(form);
			forEach(files, function (file) {
				uploader.set(inputName, file);
			});

			uploader.send(postTo).then(function (xhr) {
				if (xhr.responseURL) {
					window.location = xhr.responseURL;
				} else {
					window.location.reload();
				}
			});
		});
	}

}