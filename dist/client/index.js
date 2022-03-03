"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XServerClient = void 0;
var tslib_1 = require("tslib");
var axios_1 = (0, tslib_1.__importDefault)(require("axios"));
var errors_1 = require("../errors");
(0, tslib_1.__exportStar)(require("./interface"), exports);
var BASE_URL = 'https://licenses.railgunsecurity.com/api';
var XServerClient = /** @class */ (function () {
    function XServerClient(options) {
        var _this = this;
        this.handleError = function (e) {
            var isAxiosError = axios_1.default.isAxiosError(e);
            if (!isAxiosError) {
                throw e;
            }
            if (!e.response) {
                throw new Error('This could be a CORS issue or a dropped internet connection.');
            }
            switch (e.response.status) {
                case 400: {
                    throw new errors_1.ValidationError(e.response.data.error);
                }
                case 401: {
                    throw new errors_1.AuthorizationError(e.response.data.error);
                }
                case 500: {
                    throw new errors_1.ServiceError(e.response.data.error);
                }
                default: {
                    throw new Error(e.response.data.error);
                }
            }
        };
        this.testConnection = function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var options, data, e_1;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        options = {
                            url: '/',
                            method: 'GET'
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_1 = _a.sent();
                        this.handleError(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Return all generated license keys
         */
        this.dumpKeys = function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var options, data, e_2;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        options = {
                            url: 'manage/dump',
                            method: 'POST'
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_2 = _a.sent();
                        this.handleError(e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Query license key information
         */
        this.queryKey = function (serialkey) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var options, data, e_3;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        options = {
                            url: 'manage/query',
                            method: 'POST',
                            data: {
                                serialkey: serialkey
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_3 = _a.sent();
                        this.handleError(e_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Extend the days alloted to a license key
         */
        this.extendKey = function (context) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var serialkey, days, options, data, e_4;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        serialkey = context.serialkey, days = context.days;
                        options = {
                            url: 'manage/extend',
                            method: 'POST',
                            data: {
                                serialkey: serialkey,
                                days: days
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_4 = _a.sent();
                        this.handleError(e_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Reset the specified license key
         */
        this.resetKey = function (context) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var serialkey, email, options, data, e_5;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        serialkey = context.serialkey, email = context.email;
                        options = {
                            url: 'manage/reset',
                            method: 'POST',
                            data: {
                                serialkey: serialkey,
                                email: email
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_5 = _a.sent();
                        this.handleError(e_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * List license keys attached to a specified email address
         */
        this.listKeys = function (email) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var options, data, e_6;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        options = {
                            url: 'manage/list',
                            method: 'POST',
                            data: {
                                email: email
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_6 = _a.sent();
                        this.handleError(e_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Attached discord credentials to a license key
         */
        this.bindDiscord = function (context) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var discord, serialkey, email, options, data, e_7;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        discord = context.discord, serialkey = context.serialkey, email = context.email;
                        options = {
                            url: 'manage/setup-discord',
                            method: 'POST',
                            data: {
                                discord: discord,
                                serialkey: serialkey,
                                email: email
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_7 = _a.sent();
                        this.handleError(e_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Remove discord credentials from a license key
         */
        this.unbindDiscord = function (context) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var serialkey, email, options, data, e_8;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        serialkey = context.serialkey, email = context.email;
                        options = {
                            url: 'manage/remove-discord',
                            method: 'POST',
                            data: {
                                serialkey: serialkey,
                                email: email
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_8 = _a.sent();
                        this.handleError(e_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * List available tiers
         */
        this.listTiers = function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var options, data, e_9;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        options = {
                            url: 'manage/list-tiers',
                            method: 'GET'
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_9 = _a.sent();
                        this.handleError(e_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Create an eternal license key
         */
        this.createEternalKey = function (context) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var email, tierHash, familyName, givenName, _a, days, meta, options, data, e_10;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        email = context.email, tierHash = context.tierHash, familyName = context.familyName, givenName = context.givenName, _a = context.days, days = _a === void 0 ? 0 : _a, meta = context.meta;
                        options = {
                            url: 'manage/create',
                            method: 'POST',
                            data: {
                                email: email,
                                tierHash: tierHash,
                                familyName: familyName,
                                givenName: givenName,
                                days: days,
                                meta: meta,
                                eternal: true
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_b.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_10 = _b.sent();
                        this.handleError(e_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Update attached meta information
         */
        this.updateMeta = function (context) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var serialkey, meta, options, data, e_11;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        serialkey = context.serialkey, meta = context.meta;
                        options = {
                            url: 'manage/update-meta',
                            method: 'POST',
                            data: {
                                meta: meta,
                                serialkey: serialkey
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_11 = _a.sent();
                        this.handleError(e_11);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Ban license key
         */
        this.banKey = function (context) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var serialkey, _a, state, options, data, e_12;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        serialkey = context.serialkey, _a = context.state, state = _a === void 0 ? true : _a;
                        options = {
                            url: 'manage/ban',
                            method: 'POST',
                            data: {
                                serialkey: serialkey,
                                state: state
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_b.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_12 = _b.sent();
                        this.handleError(e_12);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Create license key
         */
        this.createKey = function (context) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var email, tierHash, familyName, givenName, _a, days, meta, options, data, e_13;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        email = context.email, tierHash = context.tierHash, familyName = context.familyName, givenName = context.givenName, _a = context.days, days = _a === void 0 ? 1 : _a, meta = context.meta;
                        options = {
                            url: 'manage/create',
                            method: 'POST',
                            data: {
                                email: email,
                                tierHash: tierHash,
                                familyName: familyName,
                                givenName: givenName,
                                days: days,
                                meta: meta
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_b.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_13 = _b.sent();
                        this.handleError(e_13);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Transfer serial key to new purchase email
         */
        this.beginTransfer = function (context) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var email, serialkey, options, data, e_14;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        email = context.email, serialkey = context.serialkey;
                        options = {
                            url: 'manage/begintransfer',
                            method: 'POST',
                            data: {
                                serialkey: serialkey,
                                email: email
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_14 = _a.sent();
                        this.handleError(e_14);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Complete purchase email transfer for serial key
         */
        this.confirmTransfer = function (context) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var email, givenName, familyName, serialkey, transferCode, options, data, e_15;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        email = context.email, givenName = context.givenName, familyName = context.familyName, serialkey = context.serialkey, transferCode = context.transferCode;
                        options = {
                            url: 'manage/confirmtransfer',
                            method: 'POST',
                            data: {
                                givenName: givenName,
                                familyName: familyName,
                                email: email,
                                serialkey: serialkey,
                                transferCode: transferCode
                            }
                        };
                        return [4 /*yield*/, this.axios(options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        e_15 = _a.sent();
                        this.handleError(e_15);
                        return [3 /*break*/, 3];
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
    return XServerClient;
}());
exports.XServerClient = XServerClient;
