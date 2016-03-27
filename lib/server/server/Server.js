'use strict';

/**
* Object containing the options for the Server
* @typedef {(object)} ServerOptions
* @property {ExpressServerOptions} [express] Options for the Express (REST API) Server.
* @property {WebSocketServerOptions} [wss] Options for the WebSocket Server.
* @property {String} [mount=/] Path to mount the LucidServer on, defaults to `/` (root)
* @property {Number} [maxClients=25] Maximum amount of clients the server should handle
*/

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _ExpressServer = require('./ExpressServer');

var _ExpressServer2 = _interopRequireDefault(_ExpressServer);

var _WebSocketServer = require('./WebSocketServer');

var _WebSocketServer2 = _interopRequireDefault(_WebSocketServer);

var _Util = require('../util/Util');

var Util = _interopRequireWildcard(_Util);

var _Constants = require('../constants/Constants');

var Constants = _interopRequireWildcard(_Constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
* Manages the Express (HTTP), WebSocket Server and connections
*/

var LucidServer = function (_EventEmitter) {
  _inherits(LucidServer, _EventEmitter);

  /**
  * Creates a new LucidServer class.
  * @param  {ServerOptions} [options] Options to pass to the object.
  */

  function LucidServer(options) {
    _classCallCheck(this, LucidServer);

    /**
    * The options passed to the Server upon instantiation.
    * @type {ServerOptions}
    */

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LucidServer).call(this));

    _this.options = Util.Options(Constants.ServerDefaultOptions, options);

    /**
     * The status of the server
     * @type {ServerStatus}
     */
    _this.status = Constants.ServerStatus.UNAVAILABLE;

    /**
     * The Express Server of the Client
     * @type {LucidExpressServer}
     */
    _this.express = new _ExpressServer2.default(_this);

    /**
     * The WebSocket Server of the Client
     * @type {LucidWebSocketServer}
     */
    _this.wss = new _WebSocketServer2.default(_this);
    return _this;
  }

  /**
   * Attaches a HTTP Server to the Express and WebSocket Servers, essentially starting up the LucidServer.
   * @param  {http.Server} httpServer The HTTP Server to attach
   */


  _createClass(LucidServer, [{
    key: 'attach',
    value: function attach(httpServer) {
      this.express.attach(httpServer);
      this.wss.attach(httpServer);
    }
  }]);

  return LucidServer;
}(_events2.default);

;

exports.default = LucidServer;
module.exports = exports['default'];