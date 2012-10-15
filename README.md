## RSA utility for Node

A thin wrapper for OpenSSL's rsautl(1) for those precious few cases where native bindings don't work.


### Usage

```javascript
var rsautl = require('rsautl');

var privateKey = '...'; 
var publicKey = '...';

rsautl.encrypt('Encrypt me please!', publicKey, function (err, encrypted) {
    // encrypted contains a base64 encoded encrypted string
    if (err) return console.log('wat');
    rsautl.decrypt(encrypted, privateKey, function (err, decrypted) {
        if (err) return console.log('wat');
        console.log(decrypted); // Encrypt me please!    
    });
});

rsautl.sign('Sign me please!', privateKey, function (err, signed) {
    // signed contains a base64 encoded signed string
    if (err) return console.log('wat');
    rsautl.verify(signed, publicKey, function (err, verified) {
        if (err) return console.log('wat');
        console.log(verified); // Sign me please!    
    });
});

```


### Notes

This code writes private keys to temp files in order for openssl(1) to read them. Make sure your tempfs is based in memory. Also, since this is a command line wrapper, use it only if necessery. If you can, use native binding implementations such as ursa or nrsa.
