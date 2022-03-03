"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var crypto_js_1 = (0, tslib_1.__importDefault)(require("crypto-js"));
var SafeEncode = /** @class */ (function () {
    function SafeEncode(key) {
        var _this = this;
        this.generatePayload = function (payload) {
            var safepayload = JSON.stringify({ payload: payload });
            var encrypted = _this.encode(safepayload);
            return encrypted;
        };
        this.decodePayload = function (encrypted) {
            var decrypted = _this.decode(encrypted);
            var payload = JSON.parse(decrypted).payload;
            return payload;
        };
        this.encode = function (token) {
            var salt = crypto_js_1.default.lib.WordArray.random(32);
            var iv = crypto_js_1.default.lib.WordArray.random(32);
            var key = crypto_js_1.default.PBKDF2(_this.key, salt, {
                keySize: _this.keySize / 32,
                iterations: _this.iterations
            });
            var encryptedCypher = crypto_js_1.default.AES.encrypt(token, key, {
                mode: crypto_js_1.default.mode.CBC,
                padding: crypto_js_1.default.pad.Pkcs7,
                iv: iv
            });
            var saltedCypher = "".concat(salt.toString()).concat(iv.toString()).concat(encryptedCypher.toString());
            return Buffer.from(saltedCypher).toString('hex');
        };
        this.decode = function (raw) {
            var saltedCypher = Buffer.from(raw, 'hex').toString('utf8');
            var salt = crypto_js_1.default.enc.Hex.parse(saltedCypher.substring(0, 64));
            var iv = crypto_js_1.default.enc.Hex.parse(saltedCypher.substring(64, 128));
            var encryptedCypher = saltedCypher.substring(128);
            var key = crypto_js_1.default.PBKDF2(_this.key, salt, {
                keySize: _this.keySize / 32,
                iterations: _this.iterations
            });
            var decryptedCypher = crypto_js_1.default.AES.decrypt(encryptedCypher, key, {
                iv: iv,
                mode: crypto_js_1.default.mode.CBC,
                padding: crypto_js_1.default.pad.Pkcs7
            });
            return decryptedCypher.toString(crypto_js_1.default.enc.Utf8);
        };
        this.key = Buffer.from(key).toString('hex');
        this.iterations = 100;
        this.keySize = 256;
    }
    return SafeEncode;
}());
exports.default = SafeEncode;
