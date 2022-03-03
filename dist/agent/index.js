"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XServerAgent = void 0;
var tslib_1 = require("tslib");
var events_1 = (0, tslib_1.__importDefault)(require("events"));
var uuid_1 = require("uuid");
var socket_io_client_1 = (0, tslib_1.__importDefault)(require("socket.io-client"));
var safe_encode_1 = (0, tslib_1.__importDefault)(require("../safe-encode"));
var errors_1 = require("../errors");
var XServerAgent = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(XServerAgent, _super);
    function XServerAgent(options) {
        var _this = _super.call(this) || this;
        _this.createTimestamp = function () {
            if (!_this.seed) {
                throw new Error('Invalid Seed - No seed provided');
            }
            if (isNaN(_this.seed)) {
                throw new Error('Invalid Seed - Please specify a number');
            }
            var TOI = "".concat(Date.now() * _this.seed);
            if (TOI.length < 7) {
                throw new Error('Invalid Seed - Please use a longer seed');
            }
            return TOI.substring(TOI.length - 6, TOI.length - 1);
        };
        _this.validate = function () {
            return new Promise(function (resolve, reject) {
                try {
                    if (!_this.accessToken || !_this.accessToken.length) {
                        throw new Error('Missing access token');
                    }
                    var connectionOptions = {
                        path: _this.path,
                        transports: ['websocket', 'polling'],
                        extraHeaders: _this.headers
                    };
                    var socket_1 = (0, socket_io_client_1.default)(_this.url, connectionOptions);
                    var timestamp = _this.createTimestamp();
                    var securityKey_1 = "".concat(_this.machineToken).concat(timestamp);
                    var syncronizationKey_1 = "".concat(_this.accessToken).concat(timestamp);
                    // force timeout with custom timeout duration
                    var connectionTimout_1 = setTimeout(function () {
                        socket_1.close();
                        reject(new errors_1.AgentConnectionFailure('Connection timed out'));
                    }, _this.timeout);
                    socket_1.on('bridge-sync-error', function () {
                        socket_1.close();
                        _this.emit('deauth', new errors_1.AgentConnectionFailure('Bridge connection failed'));
                    });
                    socket_1.once('connect', function () {
                        clearTimeout(connectionTimout_1);
                        socket_1.once('sync', function () {
                            resolve({ securityKey: securityKey_1, socket: socket_1 });
                        });
                        socket_1.once('resync', function () { return socket_1.emit('sync', syncronizationKey_1); });
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        _this.connect = function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var _a, securityKey, socket, encoder, sid, solution;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validate()];
                    case 1:
                        _a = _b.sent(), securityKey = _a.securityKey, socket = _a.socket;
                        encoder = new safe_encode_1.default(securityKey);
                        sid = (0, uuid_1.v4)();
                        solution = {
                            encoder: encoder,
                            socket: socket,
                            sid: sid
                        };
                        return [2 /*return*/, solution];
                }
            });
        }); };
        _this.setMaxListeners(0);
        _this.url = options.url;
        _this.path = options.path;
        _this.seed = options.seed;
        _this.accessToken = options.accessToken;
        _this.machineToken = options.machineToken;
        _this.headers = options.headers || {};
        _this.timeout = options.timeout || 120 * 1000;
        return _this;
    }
    return XServerAgent;
}(events_1.default));
exports.XServerAgent = XServerAgent;
