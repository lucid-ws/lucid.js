'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

/**
* Object containing options for LucidWebSocketServer
* @typedef {(object)} WebSocketServerOptions
* @property {Number} [hearbeat=45000] Interval of heartbeats in milliseconds. Set to -1 to disable heartbeats.
* Heartbeats are used to verify whether connections are active.
* @property {Number} [allowedAuthTime=5000] Maximum time in milliseconds that a client has to request authentication
* before it is disconnected.
*/

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _AuthorizedClient = require('../structures/AuthorizedClient');

var _AuthorizedClient2 = _interopRequireDefault(_AuthorizedClient);

var _UnknownClient = require('../structures/UnknownClient');

var _UnknownClient2 = _interopRequireDefault(_UnknownClient);

var _Constants = require('../constants/Constants');

var Constants = _interopRequireWildcard(_Constants);

var _ws = require('ws');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The WebSocketServer handles WebSocket connections and sessions
 */

var LucidWebSocketServer = function () {
  /**
   * Creates a new WebSocketServer. Developers shouldn't instantiate this class themselves, it is done by LucidServer.
   * @param  {LucidServer} lucidServer The LucidServer that the WebSocketServer is running under.
   */

  function LucidWebSocketServer(lucidServer) {
    _classCallCheck(this, LucidWebSocketServer);

    /**
     * Lucid Server that the ExpressServer is serving under.
     * @type {LucidServer}
     */
    this.lucidServer = lucidServer;
    /**
     * Options for the WebSocketServer, obtained from the owning Server's options.
     * @type {WebSocketServerOptions}
     */
    this.options = lucidServer.options.wss;

    /**
     * The WebSocket Server that the LucidWebSocketServer class wraps around.
     * @type {ws.Server}
     */
    this.wss = null;

    /**
     * An Array of Authorized Clients.
     * @type {Array<AuthorizedClient>}
     */
    this.connections = [];
  }

  /**
   * Attaches a HTTP Server, essentially starting the WebSocket Server.
   * @param  {http.Server} httpServer The HTTP Server to attach.
   * @private
   */


  _createClass(LucidWebSocketServer, [{
    key: 'attach',
    value: function attach(httpServer) {

      // the mount point that the WS server should build upon
      var baseMount = this.lucidServer.options.mount;

      this.wss = new _ws.Server({ server: httpServer, path: baseMount + 'ws' });

      this.attachHandlers();
    }

    /**
     * Describes whether the server has the capacity to take any new connections.
     * @return {Boolean} Returns true if there is capacity for a new connection.
     */

  }, {
    key: 'attachHandlers',


    /**
     * Attach WSS Handlers
     * @private
     */
    value: function attachHandlers() {
      var _this = this;

      this.wss.on('connection', function (socket) {
        return _this.EventConnection(socket);
      });
      this.wss.on('error', function (error) {
        return _this.EventError(error);
      });
      this.wss.on('headers', function (headers) {
        return _this.EventHeaders(headers);
      });
    }

    /**
     * Handles WebSocketServer 'connection' events
     * @param {ws.WebSocket} socket
     * @private
     */

  }, {
    key: 'EventConnection',
    value: function EventConnection(socket) {
      var unknownClient = new _UnknownClient2.default(socket, this);
    }

    /**
     * Handles WebSocketServer 'error' events
     * @param {Error} error
     * @private
     */

  }, {
    key: 'EventError',
    value: function EventError(error) {}

    /**
     * Handles WebSocketServer 'headers' events
     * @param {Object} headers
     * @private
     */

  }, {
    key: 'EventHeaders',
    value: function EventHeaders(headers) {}

    /**
     * Authorizes a previously "unknown" client with a new session.
     * @param {UnknownClient} unknownClient Client to authorize
     */

  }, {
    key: 'AuthorizeNewSession',
    value: function AuthorizeNewSession(unknownClient) {
      var uuid = _crypto2.default.randomBytes(16).toString('hex');
      var token = _crypto2.default.randomBytes(64).toString('base64');

      unknownClient.breakDown();

      var authorizedClient = new _AuthorizedClient2.default(unknownClient.socket, // socket
      this, // wss
      uuid, // uuid
      token // token
      );

      var packetData = { uuid: uuid, token: token };
      var heartbeat = this.lucidServer.options.wss.hearbeat;

      if (this.lucidServer.options.hearbeat > -1) {
        packetData.heartbeatInterval = heartbeat;
      }

      authorizedClient.sendInternal(Constants.PacketTypes.SERVER_ACCEPT_SESSION_REQUEST, packetData);

      this.connections.push(authorizedClient);
    }
  }, {
    key: 'canAllowNewConnections',
    get: function get() {
      return this.connections.length < this.lucidServer.options.maxClients;
    }
  }]);

  return LucidWebSocketServer;
}();

;

exports.default = LucidWebSocketServer;
module.exports = exports['default'];