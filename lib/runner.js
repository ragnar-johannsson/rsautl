var exec = require('child_process').exec;
var fs = require('fs');
var temp = require('temp');

module.exports = function (options, data, key, callback) {
    var tmpFile = temp.path();
    var cmdline = options.opensslPath + ' rsautl';

    cmdline += ' -' + options.operation;
    cmdline += ' -' + options.padding;
    cmdline += ' -inkey ' + tmpFile;

    if (options.operation === 'encrypt' || options.operation === 'verify') {
        cmdline += ' -pubin';
    }

    fs.writeFile(tmpFile, key, function (err) {
        if (err) {
            fs.unlink(tmpFile);
            return callback(err);
        }

        var execOpts = { encoding: 'utf8' };
        if (options.operation === 'encrypt' || options.operation === 'sign') {
            execOpts.encoding = 'base64';
        }

        var proc = exec(cmdline, execOpts, function (err, stdout, stderr) {
            if (err) {
                fs.unlink(tmpFile);
                return callback(err);
            }

            callback(null, stdout);
            fs.unlink(tmpFile);
        });

        if (options.operation === 'decrypt' || options.operation === 'verify') {
            proc.stdin.write(new Buffer(data, 'base64'));
        } else {
            proc.stdin.write(data);
        }

        proc.stdin.end();
    });
};
