'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _Constants = require('../constants/Constants');

var Constants = _interopRequireWildcard(_Constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents a WebSocket Client.
 */

var Client = function () {

  /**
   * Creates a new Client. Developers shouldn't instantiate Client,
   * the WebSocketServer does it automatically.
   * @param {ws.WebSocket} socket the WebSocket connection
   * @param {LucidWebSocketServer} wss the WSS the Client is connected to.
   */

  function Client(socket, wss) {
    _classCallCheck(this, Client);

    /**
     * The LucidWebSocketServer that the Client is connected to.
     * @type {LucidWebSocketServer}
     */
    this.wss = wss;

    /**
     * The WebSocket connection of the Client.
     * @type {ws.WebSocket}
     */
    this.socket = socket;

    /**
     * Represents whether the Client is authorized or not.
     * @type {Boolean}
     */
    this.authorized = false;

    /**
     * An Array of Intervals. They are stored so they can be cleared if required.
     * @type {Array<Interval>}
     */
    this.intervals = [];

    /**
     * An Array of Timeouts. They are stored so they can be cleared if required.
     * @type {Array<Timeout>}
     */
    this.timeouts = [];

    /**
     * The status of the Client.
     * @type {ClientStatus}
     */
    this.status = null;

    this.attachHandlers();
  }

  /**
   * Attaches event handlers to the WebSocket
   * @private
   */


  _createClass(Client, [{
    key: 'attachHandlers',
    value: function attachHandlers() {
      var _this = this;

      var socket = this.socket;

      socket.on('message', function (data, flags) {
        return _this.PreEventMessage(data, flags);
      });
      socket.on('close', function (code, message) {
        return _this.EventClose(code, message);
      });
      socket.on('error', function (error) {
        return _this.EventError(error);
      });
    }

    /**
     * Removes all message, close and error event listeners.
     */

  }, {
    key: 'detachHandlers',
    value: function detachHandlers() {
      var socket = this.socket;

      socket.removeAllListeners('message');
      socket.removeAllListeners('close');
      socket.removeAllListeners('error');
    }

    /**
     * Handles the WebSocket 'message' event and normalizes data
     * @param {String|Buffer} data The received data.
     * @param {Object} flags Object containing 'binary' member.
     */

  }, {
    key: 'PreEventMessage',
    value: function PreEventMessage(data, flags) {

      // turn data into string

      if (flags.binary) {
        try {
          // try to inflate the data
          data = _zlib2.default.inflateSync(data).toString();
        } catch (e) {
          return this.EventError(Constants.Errors.INVALID_MESSAGE_FROM_CLIENT);
        }
      }

      // parse json data
      try {
        data = JSON.parse(data);
      } catch (e) {
        return this.EventError(Constants.Errors.INVALID_MESSAGE_FROM_CLIENT);
      }

      if (!data.t) {
        return this.EventError(Constants.Errors.INVALID_MESSAGE_FROM_CLIENT);
      }

      // data is now a valid packet

      this.EventMessage(data);
    }

    /**
     * Handles normalized data from 'PreEventMessage'
     * @param {Object} packet The received packet
     * @abstract
     */

  }, {
    key: 'EventMessage',
    value: function EventMessage(packet) {}

    /**
     * Handles the WebSocket 'close' event
     * @param {Number} code The close code
     * @param {String} message The given close message
     */

  }, {
    key: 'EventClose',
    value: function EventClose(code, message) {}

    /**
     * Handles the WebSocket 'error' event
     * @param {Error} error An error
     */

  }, {
    key: 'EventError',
    value: function EventError(error) {}

    /**
     * Sends a custom packet to the Client
     * @param {String} type packet type
     * @param {Object} data packet data
     */

  }, {
    key: 'send',
    value: function send(type, data) {
      type = 'custom_' + type;
      return this.sendInternal(type, data);
    }

    /**
     * Sends an unmodified packet to the Client
     * @param {String} type packet type
     * @param {Object} data packet data
     */

  }, {
    key: 'sendInternal',
    value: function sendInternal(type, data) {
      var t = type;
      var d = data || {};
      this.socket.send(JSON.stringify({ t: t, d: d }));
    }

    /**
     * Kills connection to the client
     * @param {Number} reason A numeric reason, see DisconnectTypes.
     * @param  {Boolean} [returnAllowed=true] States whether the Client is allowed to return to their session
     * after being disconnected.
     * @param {Object} [extra] Extra information about the disconnect, useful for custom disconnect reasons.
     */

  }, {
    key: 'killConnection',
    value: function killConnection(reason) {
      var returnAllowed = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
      var extra = arguments[2];

      var data = {
        r: reason
      };

      if (extra) {
        data.e = extra;
      }

      if (this.authorized) {
        data.returnAllowed = Boolean(returnAllowed);
      }

      this.sendInternal(Constants.PacketTypes.SERVER_DISCONNECTING_CLIENT, data);

      if (data.returnAllowed) {
        this.cleanWebSocket();
      } else {
        this.cleanWebSocket();
        this.removeReferences();
      }
    }

    /**
     * Terminates the WebSocket and cleans all WebSocket related information, but doesn't end the session.
     * @ignore
     */

  }, {
    key: 'cleanWebSocket',
    value: function cleanWebSocket() {
      this.socket.close();

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.intervals[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var interval = _step.value;

          clearInterval(interval);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.timeouts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var timeout = _step2.value;

          clearTimeout(timeout);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    /**
     * Removes references to the Client internally
     * @ignore
     */

  }, {
    key: 'removeReferences',
    value: function removeReferences() {
      var index = this.wss.connections.indexOf(this);
      if (index > -1) {
        this.wss.connections.splice(index, 1);
      }
    }
  }]);

  return Client;
}();

exports.default = Client;
module.exports = exports['default'];