'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Client2 = require('./Client');

var _Client3 = _interopRequireDefault(_Client2);

var _Constants = require('../constants/Constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents a WebSocket Client that has connected, but has not authorised/authorized yet.
 */

var UnknownClient = function (_Client) {
  _inherits(UnknownClient, _Client);

  /**
   * Creates a new UnknownClient. Developers shouldn't instantiate UnknownClient,
   * the WebSocketServer does it automatically.
   * @param {ws.WebSocket} socket the WebSocket connection
   * @param {LucidWebSocketServer} wss the WSS the Client is connected to.
   */

  function UnknownClient(socket, wss) {
    _classCallCheck(this, UnknownClient);

    /**
     * @ignore
     */

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UnknownClient).call(this, socket, wss));

    _this.status = _Constants.ClientStatus.UNAUTHORIZED;

    _this._passedAuth = false;

    setTimeout(function () {
      return _this.checkAuth();
    }, _this.wss.lucidServer.options.wss.allowedAuthTime);
    return _this;
  }

  /**
   * Checks whether or not the Client has been authenticated. If it hasn't, it is disconnected.
   */


  _createClass(UnknownClient, [{
    key: 'checkAuth',
    value: function checkAuth() {
      if (!this._passedAuth) {
        return this.killConnection(_Constants.DisconnectTypes.TOOK_TOO_LONG_TO_AUTH);
      }
    }

    /**
     * Handles packet events
     * @param {Object} packet the received packet
     */

  }, {
    key: 'EventMessage',
    value: function EventMessage(packet) {
      _get(Object.getPrototypeOf(UnknownClient.prototype), 'EventMessage', this).call(this, packet);
      switch (packet.t) {
        case _Constants.PacketTypes.CLIENT_NEW_SESSION_REQUEST:

          // takes no data
          if (this.wss.canAllowNewConnections) {
            // can take a new connection
            this._passedAuth = true;
            this.wss.AuthorizeNewSession(this);
          } else {
            // can't take any more connections
            return this.killConnection(_Constants.DisconnectTypes.SERVER_AT_MAXIMUM_CAPACITY);
          }

          break;
        case _Constants.PacketTypes.CLIENT_EXISTING_SESSION_REQUEST:
          break;
      }
    }

    /**
     * Breaks down the unknown client, removing listeners.
     */

  }, {
    key: 'breakDown',
    value: function breakDown() {
      this.detachHandlers();
    }
  }]);

  return UnknownClient;
}(_Client3.default);

exports.default = UnknownClient;
module.exports = exports['default'];