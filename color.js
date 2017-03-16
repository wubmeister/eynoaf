var fs = require('fs');

const hexDigits = '0123456789ABCDEF';
const names = [ 'primary', 'secondary', 'info', 'success', 'warning', 'danger', 'gray' ];

function clip(value, minValue, maxValue) {
    return Math.max(minValue, Math.min(maxValue, value));
}

function hexToRgb(hex) {
    var rgb, short;

    hex = hex.replace(/^#/, '');
    short = hex.length == 3;

    rgb = {
        red: short ? 17 * parseInt(hex[0], 16) : parseInt(hex.substr(0, 2), 16),
        green: short ? 17 * parseInt(hex[1], 16) : parseInt(hex.substr(2, 2), 16),
        blue: short ? 17 * parseInt(hex[2], 16) : parseInt(hex.substr(4, 2), 16)
    };

    rgb.redFloat = rgb.red / 255;
    rgb.greenFloat = rgb.green / 255;
    rgb.blueFloat = rgb.blue / 255;

    return rgb;
}

function rgbToHsv(rgb) {
    var hsv = {};

    var cmax = Math.max(rgb.redFloat, rgb.greenFloat, rgb.blueFloat);
    var cmin = Math.min(rgb.redFloat, rgb.greenFloat, rgb.blueFloat);
    var delta = cmax - cmin;

    if (delta == 0) {
        hsv.hue = 0;
    } else if (cmax == rgb.redFloat) {
        hsv.hue = 60 * (((rgb.greenFloat - rgb.blueFloat) / delta) % 6);
    } else if (cmax == rgb.greenFloat) {
        hsv.hue = 60 * (((rgb.blueFloat - rgb.redFloat) / delta) + 2);
    } else if (cmax == rgb.blueFloat) {
        hsv.hue = 60 * (((rgb.redFloat - rgb.greenFloat) / delta) + 4);
    }
    hsv.saturation = cmax > 0 ? delta / cmax : 0;
    hsv.value = cmax;

    return hsv;
}

function hsvToRgb(hsv) {
    var rgb = {};

    var c = hsv.value * hsv.saturation;
    var x = c * (1 - Math.abs((hsv.hue / 60) % 2 - 1))
    var m = hsv.value - c;

    if (hsv.hue < 60) {
        rgb = { redFloat: clip(c + m, 0, 1), greenFloat: clip(x + m, 0, 1), blueFloat: clip(m, 0, 1) };
    } else if (hsv.hue < 120) {
        rgb = { redFloat: clip(x + m, 0, 1), greenFloat: clip(c + m, 0, 1), blueFloat: clip(m, 0, 1) };
    } else if (hsv.hue < 180) {
        rgb = { redFloat: clip(m, 0, 1), greenFloat: clip(c + m, 0, 1), blueFloat: clip(x + m, 0, 1) };
    } else if (hsv.hue < 240) {
        rgb = { redFloat: clip(m, 0, 1), greenFloat: clip(x + m, 0, 1), blueFloat: clip(c + m, 0, 1) };
    } else if (hsv.hue < 300) {
        rgb = { redFloat: clip(x + m, 0, 1), greenFloat: clip(m, 0, 1), blueFloat: clip(c + m, 0, 1) };
    } else {
        rgb = { redFloat: clip(c + m, 0, 1), greenFloat: clip(m, 0, 1), blueFloat: clip(x + m, 0, 1) };
    }

    rgb.red = Math.round(rgb.redFloat * 255);
    rgb.green = Math.round(rgb.greenFloat * 255);
    rgb.blue = Math.round(rgb.blueFloat * 255);

    return rgb;
}

function rgbToHex(rgb) {
    var hex, hexStr;

    hex = [ Math.floor(rgb.red / 16), rgb.red % 16, Math.floor(rgb.green / 16), rgb.green % 16, Math.floor(rgb.blue / 16), rgb.blue % 16 ];

    hexStr = hex.reduce(function (carry, value) {
        return carry + hexDigits[value];
    }, '');

    return hexStr;
}

var i, name;
var rgb, hsv, darkHsv, lightHsv, lighterHsv, dvs;
var less = '';

for (i = 2; i < process.argv.length; i++) {
    name = names[i-2];

    rgb = hexToRgb(process.argv[i]);

    // lum = (0.2126*rgb.redFloat + 0.7152*rgb.greenFloat + 0.0722*rgb.blueFloat);
    // console.log(lum);

    hsv = rgbToHsv(rgb);

    darkHsv = Object.create(hsv);
    darkHsv.saturation = darkHsv.saturation + 0.1;
    darkHsv.value = darkHsv.value - 0.15;

    lightHsv = Object.create(hsv);
    lightHsv.saturation = lightHsv.saturation - 0.1;
    lightHsv.value = lightHsv.value + 0.15;

    lighterHsv = Object.create(hsv);
    dvs = lighterHsv.saturation - 0.1;

    if (dvs > 0) {
        lighterHsv.saturation = 0.1;
        lighterHsv.value = Math.min(1, lighterHsv.value + (dvs * 1.5));
    } else {
        dvs = 0.9 - lighterHsv.value;
        if (dvs > 0) {
            lighterHsv.saturation = Math.max(0, lighterHsv.saturation - (dvs / 1.5));
            lighterHsv.value = 0.9;
        }
    }

    less += '@color-' + name + ': #' + rgbToHex(rgb) + ';' + "\n";
    less += '@color-' + name + '-dark: #' + rgbToHex(hsvToRgb(darkHsv)) + ';' + "\n";
    less += '@color-' + name + '-light: #' + rgbToHex(hsvToRgb(lightHsv)) + ';' + "\n";
    less += '@color-' + name + '-background: #' + rgbToHex(hsvToRgb(lighterHsv)) + ';' + "\n";
}

// fs.writeFile('colors.less', less, 'utf8', function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Written to colors.less');
//     }
// });
console.log(less);