'use strict';

var _ = require('../../');

var Lucid = _interopRequireWildcard(_);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @ignore
 */
var lucid = new Lucid.Server.LucidServer();

/**
 * @ignore
 */
var server = _http2.default.createServer();

lucid.attach(server);

server.listen(25543);

/**
 * @ignore
 */
var h = new _ws2.default('ws://localhost:25543/ws');

h.onopen = function (e) {};

h.onmessage = function (e) {
  console.log(e.data);
};