'use strict';

/**
* Object containing the options for the Server
* @typedef {(object)} ServerOptions
* @property {ExpressServerOptions} [express] Options for the Express (REST API) Server.
* @property {WebSocketServerOptions} [wss] Options for the WebSocket Server.
* @property {String} [mount=/] Path to mount the LucidServer on, defaults to `/` (root)
* @property {Number} [maxClients=25] Maximum amount of clients the server should handle
*/

import EventEmitter from 'events';
import ExpressServer from './ExpressServer';
import WebSocketServer from './WebSocketServer';
import * as Util from '../util/Util';
import * as Constants from '../constants/Constants';

/**
* Manages the Express (HTTP), WebSocket Server and connections
*/
class LucidServer extends EventEmitter{

  /**
  * Creates a new LucidServer class.
  * @param  {ServerOptions} [options] Options to pass to the object.
  */
  constructor(options) {
    super();
    /**
    * The options passed to the Server upon instantiation.
    * @type {ServerOptions}
    */
    this.options = Util.Options(Constants.ServerDefaultOptions, options);

    /**
     * The status of the server
     * @type {ServerStatus}
     */
    this.status = Constants.ServerStatus.UNAVAILABLE;

    /**
     * The Express Server of the Client
     * @type {LucidExpressServer}
     */
    this.express = new ExpressServer(this);

    /**
     * The WebSocket Server of the Client
     * @type {LucidWebSocketServer}
     */
    this.wss = new WebSocketServer(this);
  }

  /**
   * Attaches a HTTP Server to the Express and WebSocket Servers, essentially starting up the LucidServer.
   * @param  {http.Server} httpServer The HTTP Server to attach
   */
  attach(httpServer) {
    this.express.attach(httpServer);
    this.wss.attach(httpServer);
  }

};

export default LucidServer;
