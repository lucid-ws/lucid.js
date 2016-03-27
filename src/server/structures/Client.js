'use strict';

import zlib from 'zlib';
import * as Constants from '../constants/Constants';

/**
 * Represents a WebSocket Client.
 */
class Client{

  /**
   * Creates a new Client. Developers shouldn't instantiate Client,
   * the WebSocketServer does it automatically.
   * @param {ws.WebSocket} socket the WebSocket connection
   * @param {LucidWebSocketServer} wss the WSS the Client is connected to.
   */
  constructor(socket, wss) {
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
  attachHandlers() {
    let socket = this.socket;

    socket.on('message', (data, flags) => this.PreEventMessage(data, flags));
    socket.on('close', (code, message) => this.EventClose(code, message));
    socket.on('error', (error) => this.EventError(error));
  }

  /**
   * Removes all message, close and error event listeners.
   */
  detachHandlers() {
    let socket = this.socket;

    socket.removeAllListeners('message');
    socket.removeAllListeners('close');
    socket.removeAllListeners('error');
  }

  /**
   * Handles the WebSocket 'message' event and normalizes data
   * @param {String|Buffer} data The received data.
   * @param {Object} flags Object containing 'binary' member.
   */
  PreEventMessage(data, flags) {

    // turn data into string

    if (flags.binary) {
      try {
        // try to inflate the data
        data = zlib.inflateSync(data).toString();
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
  EventMessage(packet) {

  }

  /**
   * Handles the WebSocket 'close' event
   * @param {Number} code The close code
   * @param {String} message The given close message
   */
  EventClose(code, message) {

  }

  /**
   * Handles the WebSocket 'error' event
   * @param {Error} error An error
   */
  EventError(error) {

  }

  /**
   * Sends a custom packet to the Client
   * @param {String} type packet type
   * @param {Object} data packet data
   */
  send(type, data) {
    type = 'custom_' + type;
    return this.sendInternal(type, data);
  }

  /**
   * Sends an unmodified packet to the Client
   * @param {String} type packet type
   * @param {Object} data packet data
   */
  sendInternal(type, data) {
    let t = type;
    let d = data || {};
    this.socket.send(JSON.stringify({ t, d }));
  }

  /**
   * Kills connection to the client
   * @param {Number} reason A numeric reason, see DisconnectTypes.
   * @param  {Boolean} [returnAllowed=true] States whether the Client is allowed to return to their session
   * after being disconnected.
   * @param {Object} [extra] Extra information about the disconnect, useful for custom disconnect reasons.
   */
  killConnection(reason, returnAllowed=true, extra) {
    let data = {
      r: reason,
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
  cleanWebSocket() {
    this.socket.close();

    for (let interval of this.intervals) {
      clearInterval(interval);
    }

    for (let timeout of this.timeouts) {
      clearTimeout(timeout);
    }
  }

  /**
   * Removes references to the Client internally
   * @ignore
   */
  removeReferences() {
    let index = this.wss.connections.indexOf(this);
    if (index > -1) {
      this.wss.connections.splice(index, 1);
    }
  }
}

export default Client;
