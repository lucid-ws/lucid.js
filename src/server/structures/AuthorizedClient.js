'use strict';

import {PacketTypes, DisconnectTypes, ClientStatus} from '../constants/Constants';
import Client from './Client';

/**
 * Represents a WebSocket Client that has authorised/authorized themselves.
 */
class AuthorizedClient extends Client{

  /**
   * Creates a new AuthorizedClient. Developers shouldn't instantiate AuthorizedClients,
   * the WebSocketServer does it automatically.
   * @param {ws.WebSocket} socket the WebSocket connection
   * @param {LucidWebSocketServer} wss the WSS the Client is connected to.
   * @param {String} uuid The UUID of the Client
   * @param {String} token The private token of the Client
   */
  constructor(socket, wss, uuid, token) {
    super(socket, wss);

    /**
     * ACTIVE by default because when an AuthorizedClient is first created, it means a WebSocket connection
     * is active
     * @ignore
     */
    this.status = ClientStatus.ACTIVE;

    /**
     * @ignore
     */
    this.authorized = true;

    /**
     * The UUID of the Client
     * @type {String}
     */
    this.uuid = uuid;

    /**
     * The private token of the Client
     * @type {String}
     */
    this.token = token;
  }
}

export default AuthorizedClient;
