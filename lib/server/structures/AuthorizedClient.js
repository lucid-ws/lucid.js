'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Constants = require('../constants/Constants');

var _Client2 = require('./Client');

var _Client3 = _interopRequireDefault(_Client2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents a WebSocket Client that has authorised/authorized themselves.
 */

var AuthorizedClient = function (_Client) {
  _inherits(AuthorizedClient, _Client);

  /**
   * Creates a new AuthorizedClient. Developers shouldn't instantiate AuthorizedClients,
   * the WebSocketServer does it automatically.
   * @param {ws.WebSocket} socket the WebSocket connection
   * @param {LucidWebSocketServer} wss the WSS the Client is connected to.
   * @param {String} uuid The UUID of the Client
   * @param {String} token The private token of the Client
   */

  function AuthorizedClient(socket, wss, uuid, token) {
    _classCallCheck(this, AuthorizedClient);

    /**
     * ACTIVE by default because when an AuthorizedClient is first created, it means a WebSocket connection
     * is active
     * @ignore
     */

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AuthorizedClient).call(this, socket, wss));

    _this.status = _Constants.ClientStatus.ACTIVE;

    /**
     * @ignore
     */
    _this.authorized = true;

    /**
     * The UUID of the Client
     * @type {String}
     */
    _this.uuid = uuid;

    /**
     * The private token of the Client
     * @type {String}
     */
    _this.token = token;
    return _this;
  }

  return AuthorizedClient;
}(_Client3.default);

exports.default = AuthorizedClient;
module.exports = exports['default'];