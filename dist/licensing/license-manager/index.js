"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseManager = void 0;
var tslib_1 = require("tslib");
var socket_io_client_1 = (0, tslib_1.__importDefault)(require("socket.io-client"));
var events_1 = (0, tslib_1.__importDefault)(require("events"));
var axios_1 = (0, tslib_1.__importDefault)(require("axios"));
var safe_encode_1 = (0, tslib_1.__importDefault)(require("../../safe-encode"));
var errors_1 = require("../../errors");
var LicenseManager = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LicenseManager, _super);
    function LicenseManager(options) {
        var _this = _super.call(this) || this;
        _this.decode = function (token) {
            var _a;
            return (_a = _this.encoder) === null || _a === void 0 ? void 0 : _a.decodePayload(token);
        };
        _this.handleuser = function (data) {
            var user = _this.decode(data);
            _this.emit('currentUser', user);
        };
        _this.handledeauthorization = function (data) {
            var decoded = _this.decode(data);
            _this.emit('deauthorized', decoded);
        };
        _this.createlink = function (socket) {
            socket.on('currentUser', _this.handleuser);
            socket.on('deauth', _this.handledeauthorization);
            _this.on('getUser', function () { return socket.emit('fetchUser'); });
            _this.emit('linked');
            _this.socket = socket;
        };
        _this.waitforconnection = function (socket) {
            return new Promise(function (resolve, reject) {
                // force timeout with custom timeout duration
                var connectionTimout = setTimeout(function () {
                    socket.disconnect();
                    reject(new errors_1.LicenseServerUnavailable('Connection timed out'));
                }, _this.timeout);
                socket.once('connect', function () {
                    clearTimeout(connectionTimout);
                });
                socket.once('forbidden', function () { return reject(new Error('Forbidden')); });
                socket.once('authorized', function () { return resolve(socket); });
            });
        };
        _this.createConnection = function (cis) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var cid, extraHeaders, options, socket;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.encoder = new safe_encode_1.default(cis);
                        cid = this.muid;
                        extraHeaders = {
                            cid: cid,
                            cis: cis
                        };
                        options = {
                            autoConnect: true,
                            secure: true,
                            path: '/serverpulse',
                            rejectUnauthorized: true,
                            transports: ['polling'],
                            rememberTransport: false,
                            transportOptions: {
                                polling: {
                                    extraHeaders: extraHeaders
                                }
                            }
                        };
                        socket = (0, socket_io_client_1.default)(this.host, options);
                        return [4 /*yield*/, this.waitforconnection(socket)];
                    case 1:
                        _a.sent();
                        this.createlink(socket);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.disconnect = function () {
            var _a, _b;
            (_a = _this.socket) === null || _a === void 0 ? void 0 : _a.disconnect();
            (_b = _this.socket) === null || _b === void 0 ? void 0 : _b.emit('deactivate');
        };
        _this.setMaxListeners(0);
        _this.muid = options.muid;
        _this.productId = options.productId;
        _this.socket = null;
        _this.encoder = null;
        _this.timeout = options.timeout || 60 * 1000;
        _this.host = options.host || 'https://licenses.railgunsecurity.com';
        _this.axios = axios_1.default.create({
            baseURL: _this.host
        });
        return _this;
    }
    LicenseManager.prototype.chainLicense = function (token) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createConnection(token)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LicenseManager.prototype.checkLicense = function (license) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var options, _a, success, token, error, e_1, isAxiosError, _b, error;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        options = {
                            url: "api/v2/authorize/validate",
                            method: 'POST',
                            timeout: this.timeout,
                            data: {
                                serialkey: license,
                                muid: this.muid,
                                pid: this.productId
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        _a = (_c.sent()).data, success = _a.success, token = _a.token, error = _a.error;
                        if (!success) {
                            throw new Error(error || 'Invalid Key');
                        }
                        if (!token) {
                            throw new Error('Secure link unavailable');
                        }
                        this.emit('connected', token);
                        return [4 /*yield*/, this.createConnection(token)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _c.sent();
                        isAxiosError = axios_1.default.isAxiosError(e_1);
                        if (!isAxiosError) {
                            throw e_1;
                        }
                        if (!e_1.response) {
                            throw new Error('This could be a CORS issue or a dropped internet connection.');
                        }
                        _b = e_1.response.data.error, error = _b === void 0 ? 'License server is temporarily unavailable' : _b;
                        throw new errors_1.LicenseServerUnavailable(error);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LicenseManager.prototype.activateLicense = function (license) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var options, _a, success, token, error, e_2, isAxiosError, _b, error;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        options = {
                            url: "api/v2/authorize/activate",
                            method: 'POST',
                            timeout: this.timeout,
                            data: {
                                serialkey: license,
                                muid: this.muid,
                                pid: this.productId
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        _a = (_c.sent()).data, success = _a.success, token = _a.token, error = _a.error;
                        if (!success) {
                            throw new Error(error);
                        }
                        if (!token) {
                            throw new Error('Secure link unavailable');
                        }
                        this.emit('connected', token);
                        return [4 /*yield*/, this.createConnection(token)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _c.sent();
                        isAxiosError = axios_1.default.isAxiosError(e_2);
                        if (!isAxiosError) {
                            throw e_2;
                        }
                        if (!e_2.response) {
                            throw new Error('This could be a CORS issue or a dropped internet connection.');
                        }
                        _b = e_2.response.data.error, error = _b === void 0 ? 'License server is temporarily unavailable' : _b;
                        throw new errors_1.LicenseServerUnavailable(error);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LicenseManager;
}(events_1.default));
exports.LicenseManager = LicenseManager;
