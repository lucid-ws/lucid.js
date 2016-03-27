'use strict';

import crypto from 'crypto';
import AuthorizedClient from '../structures/AuthorizedClient';
import UnknownClient from '../structures/UnknownClient';
import * as Constants from '../constants/Constants';

/**
* Object containing options for LucidWebSocketServer
* @typedef {(object)} WebSocketServerOptions
* @property {Number} [hearbeat=45000] Interval of heartbeats in milliseconds. Set to -1 to disable heartbeats.
* Heartbeats are used to verify whether connections are active.
* @property {Number} [allowedAuthTime=5000] Maximum time in milliseconds that a client has to request authentication
* before it is disconnected.
*/

import {Server} from 'ws';

/**
 * The WebSocketServer handles WebSocket connections and sessions
 */
class LucidWebSocketServer{
  /**
   * Creates a new WebSocketServer. Developers shouldn't instantiate this class themselves, it is done by LucidServer.
   * @param  {LucidServer} lucidServer The LucidServer that the WebSocketServer is running under.
   */
  constructor(lucidServer) {

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
  attach(httpServer) {

    // the mount point that the WS server should build upon
    let baseMount = this.lucidServer.options.mount;

    this.wss = new Server({ server: httpServer, path: baseMount + 'ws', });

    this.attachHandlers();

  }

  /**
   * Describes whether the server has the capacity to take any new connections.
   * @return {Boolean} Returns true if there is capacity for a new connection.
   */
  get canAllowNewConnections() {
    return this.connections.length < this.lucidServer.options.maxClients;
  }

  /**
   * Attach WSS Handlers
   * @private
   */
  attachHandlers() {
    this.wss.on('connection', (socket) => this.EventConnection(socket));
    this.wss.on('error', (error) => this.EventError(error));
    this.wss.on('headers', (headers) => this.EventHeaders(headers));
  }

  /**
   * Handles WebSocketServer 'connection' events
   * @param {ws.WebSocket} socket
   * @private
   */
  EventConnection(socket) {
    let unknownClient = new UnknownClient(socket, this);
  }

  /**
   * Handles WebSocketServer 'error' events
   * @param {Error} error
   * @private
   */
  EventError(error) {

  }

  /**
   * Handles WebSocketServer 'headers' events
   * @param {Object} headers
   * @private
   */
  EventHeaders(headers) {

  }

  /**
   * Authorizes a previously "unknown" client with a new session.
   * @param {UnknownClient} unknownClient Client to authorize
   */
  AuthorizeNewSession(unknownClient) {
    let uuid = crypto.randomBytes(16).toString('hex');
    let token = crypto.randomBytes(64).toString('base64');

    unknownClient.breakDown();

    let authorizedClient = new AuthorizedClient(
      unknownClient.socket, // socket
      this, // wss
      uuid, // uuid
      token // token
    );

    let packetData = { uuid, token };
    let heartbeat = this.lucidServer.options.wss.hearbeat;

    if (this.lucidServer.options.hearbeat > -1) {
      packetData.heartbeatInterval = heartbeat;
    }

    authorizedClient.sendInternal(Constants.PacketTypes.SERVER_ACCEPT_SESSION_REQUEST, packetData);

    this.connections.push(authorizedClient);
  }
};

export default LucidWebSocketServer;
