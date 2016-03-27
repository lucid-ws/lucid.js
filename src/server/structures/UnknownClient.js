'use strict';

import Client from './Client';
import {PacketTypes, DisconnectTypes, ClientStatus} from '../constants/Constants';

/**
 * Represents a WebSocket Client that has connected, but has not authorised/authorized yet.
 */
class UnknownClient extends Client{

  /**
   * Creates a new UnknownClient. Developers shouldn't instantiate UnknownClient,
   * the WebSocketServer does it automatically.
   * @param {ws.WebSocket} socket the WebSocket connection
   * @param {LucidWebSocketServer} wss the WSS the Client is connected to.
   */
  constructor(socket, wss) {
    super(socket, wss);

    /**
     * @ignore
     */
    this.status = ClientStatus.UNAUTHORIZED;

    this._passedAuth = false;

    setTimeout(() => this.checkAuth(), this.wss.lucidServer.options.wss.allowedAuthTime);
  }

  /**
   * Checks whether or not the Client has been authenticated. If it hasn't, it is disconnected.
   */
  checkAuth() {
    if (!this._passedAuth) {
      return this.killConnection(DisconnectTypes.TOOK_TOO_LONG_TO_AUTH);
    }
  }

  /**
   * Handles packet events
   * @param {Object} packet the received packet
   */
  EventMessage(packet) {
    super.EventMessage(packet);
    switch (packet.t){
      case PacketTypes.CLIENT_NEW_SESSION_REQUEST:

        // takes no data
        if (this.wss.canAllowNewConnections) {
          // can take a new connection
          this._passedAuth = true;
          this.wss.AuthorizeNewSession(this);

        } else {
          // can't take any more connections
          return this.killConnection(DisconnectTypes.SERVER_AT_MAXIMUM_CAPACITY);
        }

        break;
      case PacketTypes.CLIENT_EXISTING_SESSION_REQUEST:
        break;
    }
  }

  /**
   * Breaks down the unknown client, removing listeners.
   */
  breakDown() {
    this.detachHandlers();
  }
}

export default UnknownClient;
