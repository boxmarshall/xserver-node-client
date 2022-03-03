"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XServerManager = void 0;
var tslib_1 = require("tslib");
var axios_1 = (0, tslib_1.__importDefault)(require("axios"));
var safe_encode_1 = (0, tslib_1.__importDefault)(require("../safe-encode"));
var errors_1 = require("../errors");
(0, tslib_1.__exportStar)(require("./interface"), exports);
var BASE_URL = 'https://licenses.railgunsecurity.com/api';
var XServerManager = /** @class */ (function () {
    function XServerManager(options) {
        var _this = this;
        this.generateEncoder = function (data) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var tokenVariation, accessToken, machineToken, securityKey, encoder;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenVariation = "".concat(data).substring(data.length - 6, data.length - 1);
                        accessToken = "".concat(data).substring(0, data.length - 6);
                        return [4 /*yield*/, this.fetchMachineToken({ accessToken: accessToken })];
                    case 1:
                        machineToken = _a.sent();
                        securityKey = "".concat(machineToken).concat(tokenVariation);
                        encoder = new safe_encode_1.default(securityKey);
                        return [2 /*return*/, {
                                encoder: encoder,
                                machineToken: machineToken
                            }];
                }
            });
        }); };
        this.fetchMachineToken = function (config) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var machineToken, _a, token, e_1, isAxiosError, _b, error;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getID(config)];
                    case 1:
                        machineToken = _c.sent();
                        _a = machineToken.token, token = _a === void 0 ? '' : _a;
                        if (!token || !token.length) {
                            throw new Error('No token available');
                        }
                        return [2 /*return*/, token];
                    case 2:
                        e_1 = _c.sent();
                        isAxiosError = axios_1.default.isAxiosError(e_1);
                        if (!isAxiosError) {
                            throw e_1;
                        }
                        if (!e_1.response) {
                            throw new Error('This could be a CORS issue or a dropped internet connection.');
                        }
                        _b = e_1.response.data.error, error = _b === void 0 ? 'License server is temporarily unavailable' : _b;
                        throw new errors_1.ManagerError(error);
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getID = function (config) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var options, data, e_2, isAxiosError, _a, error;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        options = {
                            url: "v2/ping-base/get-id",
                            method: 'POST',
                            data: {
                                accessToken: config.accessToken
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_b.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_2 = _b.sent();
                        isAxiosError = axios_1.default.isAxiosError(e_2);
                        if (!isAxiosError) {
                            throw e_2;
                        }
                        if (!e_2.response) {
                            throw new Error('This could be a CORS issue or a dropped internet connection.');
                        }
                        _a = e_2.response.data.error, error = _a === void 0 ? 'License server is temporarily unavailable' : _a;
                        throw new errors_1.ManagerError(error);
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.validateCat = function (config) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var options, data, e_3, isAxiosError, _a, error;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        options = {
                            url: "v2/ping-base/validate-cat",
                            method: 'POST',
                            data: {
                                cat: config.cat
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_b.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_3 = _b.sent();
                        isAxiosError = axios_1.default.isAxiosError(e_3);
                        if (!isAxiosError) {
                            throw e_3;
                        }
                        if (!e_3.response) {
                            throw new Error('This could be a CORS issue or a dropped internet connection.');
                        }
                        _a = e_3.response.data.error, error = _a === void 0 ? 'License server is temporarily unavailable' : _a;
                        throw new errors_1.ManagerError(error);
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.apiKey = options.apiKey;
        this.axios = axios_1.default.create({
            baseURL: options.baseUrl || BASE_URL,
            headers: {
                authorization: "Bearer ".concat(this.apiKey)
            },
        });
    }
    return XServerManager;
}());
exports.XServerManager = XServerManager;
