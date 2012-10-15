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

function operation (data, key, callback, options) {
    var options = options || {};

    for (var attr in defaults) { 
        if (!options[attr]) options[attr] = defaults[attr];
    }

    options.operation = operation.caller.name;

    try {
        verifyOptions(options);
        run(options, data, key, callback);
    } catch (err) {
        return callback(err);
    }
}

exports.encrypt = function encrypt (data, key, callback, options) { operation(data, key, callback, options); };
exports.decrypt = function decrypt (data, key, callback, options) { operation(data, key, callback, options); };
exports.sign = function sign (data, key, callback, options) { operation(data, key, callback, options); };
exports.verify = function verify (data, key, callback, options) { operation(data, key, callback, options); };
