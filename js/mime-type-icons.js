function selectIconByMimeType(mimeType, filename) {
	var type, iconType, extension, m;

	type = mimeType ? mimeType.split('/') : [ '', '' ];
	iconType = 'other';
	extension = '';
	if (m = filename.match(/\.([^\.\/]+)$/)) {
		extension = m[1].toLowerCase();
	}

	switch (type[0]) {
		case 'application':
			if (type == 'octet-stream') {
				if (extension == 'psd') {
					iconType = 'psd';
				} else if (extension == 'exe' || extension == 'com') {
					iconType = 'executable';
				}
			} else if (type == 'postscript') {
				iconType = 'image';
			} else if ([ 'arj', 'x-gtar', 'x-compressed', 'x-zip-compressed', 'x-compres', 'x-gzip', 'x-tar', 'gnutar', 'zip', 'x-bzip2', 'x-bzip' ].indexOf(type[1]) > -1) {
				iconType = 'archive';
			} else if ([ 'x-bsh', 'java', 'x-java-class', 'x-pointplus', 'x-javascript', 'javascript', 'ecmascript', 'x-sh' ].indexOf(type[1]) > -1) {
				iconType = 'text';
			} else if ([ 'x-mplayer2', 'x-troff-msvideo', 'x-dvi' ].indexOf(type[1]) > -1) {
				iconType = 'video';
			} else if ([ 'x-x509-ca-cert', 'x-x509-user-cert' ].indexOf(type[1]) > -1) {
				iconType = 'certificate';
			} else if ([ 'msword', 'word', 'vnd.ms-word', 'x-word', 'x-msword' ].indexOf(type[1]) > -1) {
				iconType = 'word';
			} else if ([ 'mspowerpoint', 'powerpoint', 'vnd.ms-powerpoint', 'x-powerpoint', 'x-mspowerpoint' ].indexOf(type[1]) > -1) {
				iconType = 'powerpoint';
			} else if ([ 'msexcel', 'excel', 'vnd.ms-excel', 'x-excel', 'x-msexcel' ].indexOf(type[1]) > -1) {
				iconType = 'excel';
			} else if ([ 'x-midi', 'vnd.rn-realmedia' ].indexOf(type[1]) > -1) {
				iconType = 'audio';
			} else if ([ 'rtf', 'x-rtf', 'plain', 'mswrite' ].indexOf(type[1]) > -1) {
				iconType = 'text';
			} else if (type[1] == 'x-shockwave-flash') {
				iconType = 'flash';
			} else if (type[1] == 'xml') {
				iconType = 'htmlxml';
			} else if (type[1] == 'pdf') {
				iconType = 'pdf';
			}
			break;

		case 'text':
			if ([ 'html', 'webviewhtml', 'sgml', 'x-sgml', 'x-server-parsed-html', 'xml' ].indexOf(type[1]) > -1) {
				iconType = 'htmlxml';
			} else {
				iconType = 'text';
			}
			break;

		case 'video':
			iconType = 'video';
			break;

		case 'audio':
		case 'music':
		case 'x-music':
			iconType = 'audio';
			break;

		case 'image':
		case 'drawing':
		case 'windows':
			iconType = 'image';
			break;

		case 'multipart':
			iconType = 'archive';
			break;

		case 'xgl':
			if (type[1] == 'drawing') {
				iconType = 'image';
			} else {
				iconType = 'video';
			}
			break;
	}

	return iconType;
}