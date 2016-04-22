var rsautl = require('../lib/rsautl');

var privateKey = 
    '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIICXAIBAAKBgQDFCUgv5ujYHAt9O//kI77WwKJiHISlnPyY00iogZSTGbIPVRD0\n' +
    'J/Oyp8ATxtHk0GCYNEhAZo2JR8UCPn4gju5D5oOacSmP3Q3BQBu57wA3CGzPbzXA\n' +
    '1KHOUkhhFs5qgPb/k/eJ0k9E09PZ+1dx55Y5NCbbE5jAhDSI7iUU3dFbxQIDAQAB\n' +
    'AoGAKaC6ZZRtYSsbqkvA1lxO92QfaocH501xeIA6+47U6vckzWR1fn/qVrZmOEdr\n' +
    'FOKJZd613RVNldFZ6A137D0GTWcU7r+Qt5DMcKd3oh3ww8Iz4m/q2ASiICLumuUx\n' +
    '8P4ydcUiry4B89232rUqlj7BoCfztzdbbAKWl790Qb8KZsECQQDupUKNZD97o2mJ\n' +
    'hw0aPgk1sXJnkLR8R0xaW1onnmqcuBofj6VdHCm1CiIfWwHabeOIujYO1xg1CVni\n' +
    'I2G8PY1ZAkEA011nTOjduFncSB8hD7jwpLNdQWGG+XcA7pf6/nsiwmu26BoojxA8\n' +
    '4y8tsJ+rmTJD0ST/Cmb/psu8orFS7UmYTQJADw2xowWd04i9UYWJWAxtvEtTMiE4\n' +
    'oVZGBLUafMFLbFNYooEHJ1ZtcxQOjvfIqCSiY6+LVWhQCJhsaQ1eTud7EQJBANKJ\n' +
    'N1xkmHYJDGLKnyQKE6n6/+kgPFJBN6xxtpHGFdmTcZ3AcKYQhpXFaL2GTmdKqkKp\n' +
    'l2HFNuHuDvf/qZqytAECQCL7+PCWeykmBRYQa5ls+4gJQh8a+XeDL5D8QdbNm/I+\n' +
    'zu4JUrnSI0Gn2JLOve63tRlq/bK0QPVZpXVEBN32aSE=\n' +
    '-----END RSA PRIVATE KEY-----';

var publicKey = 
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFCUgv5ujYHAt9O//kI77WwKJi\n' +
    'HISlnPyY00iogZSTGbIPVRD0J/Oyp8ATxtHk0GCYNEhAZo2JR8UCPn4gju5D5oOa\n' +
    'cSmP3Q3BQBu57wA3CGzPbzXA1KHOUkhhFs5qgPb/k/eJ0k9E09PZ+1dx55Y5NCbb\n' +
    'E5jAhDSI7iUU3dFbxQIDAQAB\n' +
    '-----END PUBLIC KEY-----';

exports.encryptAndDecrypt = function (test) {
    var testStr = 'This is test';

    test.expect(3);
    rsautl.encrypt(testStr, publicKey, function (err, encrypted) {
        test.ok(err === null, err);
        rsautl.decrypt(encrypted, privateKey, function (err, decrypted) {
            test.ok(err === null, 'Error: ' + err);
            test.ok(decrypted === testStr, 'Encrypted/decrypted mismatch');
        });
    });

    setTimeout(function () { test.done(); }, 500); // Allow for IO and computations to complete
}

exports.signAndVerify = function (test) {
    var testStr = 'Sign me please';

    test.expect(3);
    rsautl.sign(testStr, privateKey, function (err, signed) {
        test.ok(err === null, err);
        rsautl.verify(signed, publicKey, function (err, verified) {
            test.ok(err === null, err);
            test.ok(verified === testStr, 'Sign/verify mismatch');
        });
    });

    setTimeout(function () { test.done(); }, 500); // Allow for IO and computations to complete
}

exports.formatKey = function (test) {
    var testStr = 'Unformatted keys';
    var unformattedPublicKey = publicKey.replace(/\n/gm, '');
    var unformattedPrivateKey = privateKey.replace(/\n/gm, '');

    test.expect(5);
    test.ok(unformattedPublicKey !== publicKey, 'Unformatted public key matches formatted original');
    test.ok(unformattedPrivateKey !== privateKey, 'Unformatted private key matches formatted original');
    rsautl.encrypt(testStr, unformattedPublicKey, function (err, encrypted) {
        test.ok(err === null, err);
        rsautl.decrypt(encrypted, unformattedPrivateKey, function (err, decrypted) {
            test.ok(err === null, err);
            test.ok(decrypted === testStr, 'Encrypted/decrypted mismatch');
        });
    });

    setTimeout(function () { test.done(); }, 500); // Allow for IO and computations to complete
}

exports.formatKeyWithWindowsLineEndings = function (test) {
    var testStr = 'Keys with Windows line endings';
    var windowsPublicKey = publicKey.replace(/\n/gm, '\r\n');
    var windowsPrivateKey = privateKey.replace(/\n/gm, '\r\n');

    test.expect(5);
    test.ok(windowsPublicKey !== publicKey, 'Public key with Windows line endings matches original');
    test.ok(windowsPrivateKey !== privateKey, 'Private key with Windows line endings matches original');
    rsautl.encrypt(testStr, windowsPublicKey, function (err, encrypted) {
        test.ok(err === null, err);
        rsautl.decrypt(encrypted, windowsPrivateKey, function (err, decrypted) {
            test.ok(err === null, err);
            test.ok(decrypted === testStr, 'Encrypted/decrypted mismatch');
        });
    });

    setTimeout(function () { test.done(); }, 500); // Allow for IO and computations to complete
}
