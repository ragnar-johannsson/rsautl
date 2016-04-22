var fs = require('fs');
var run = require('./runner');

var defaults = {
    opensslPath : '/usr/bin/openssl',
    padding : 'pkcs'
};

function verifyOptions (options) {
    if (fs.existsSync !== undefined && !fs.existsSync(options.opensslPath)) {
        throw new Error(options.opensslPath + ': No such file or directory');
    }

    if (options.padding !== 'pkcs' && options.padding !== 'raw') {
        throw new Error('Unsupported padding: ' + options.padding);
    }
}

function formatKey (key) {
    if (key.indexOf('-----BEGIN') === -1 || key.indexOf('-----END') === -1) {
        return key;
    }

    var begin = key.substring(0, key.indexOf('KEY-----') + 'KEY-----'.length);
    var end = key.substring(key.indexOf('-----END'));
    var body = key.substring(begin.length, key.length - end.length).replace(/(\r\n|\n|\r)/gm, '');

    key = begin + '\n';
    for (var i = 0; i < body.length; i += 64) {
        if (body.length - i < 64) {
            key += body.substring(i);
        } else {
            key += body.substring(i, i + 64);
        }
        key += '\n';
    }
    key += end;

    return key;
}

function operation (data, key, callback, options) {
    var options = options || {};

    for (var attr in defaults) { 
        if (!options[attr]) options[attr] = defaults[attr];
    }

    options.operation = operation.caller.name;

    try {
        verifyOptions(options);
        run(options, data, formatKey(key), callback);
    } catch (err) {
        return callback(err);
    }
}

exports.encrypt = function encrypt (data, key, callback, options) { operation(data, key, callback, options); };
exports.decrypt = function decrypt (data, key, callback, options) { operation(data, key, callback, options); };
exports.sign = function sign (data, key, callback, options) { operation(data, key, callback, options); };
exports.verify = function verify (data, key, callback, options) { operation(data, key, callback, options); };
