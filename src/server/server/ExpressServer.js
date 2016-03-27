'use strict';

/**
* Object containing options for ExpressServer
* @typedef {(object)} ExpressServerOptions
*/

import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

/**
 * The LucidExpressServer handles HTTP REST requests for the Lucid Server, e.g. server metadata.
 */
class LucidExpressServer{

  /**
   * Creates a new ExpressServer. Developers shouldn't instantiate this class themselves, it is done by LucidServer.
   * @param {LucidServer} lucidServer The Lucid Server that the ExpressServer is serving under.
   */
  constructor(lucidServer) {
    /**
     * Lucid Server that the ExpressServer is serving under.
     * @type {LucidServer}
     */
    this.lucidServer = lucidServer;
    /**
     * Options for the ExpressServer, obtained from the owning Server's options.
     * @type {ExpressServerOptions}
     */
    this.options = lucidServer.options.express;

    /**
     * The express application that the server is using.
     * @type {express.Application}
     */
    this.app = express();

    /**
     * Express Router for managing core Lucid requests.
     * @type {express.Router}
     */
    this.metaRouter = express.Router();

    /**
     * Express Router for managing custom requests.
     * @type {express.Router}
     */
    this.customRouter = express.Router();

    // allow Cross-Origin Resource Sharing (external access to server)
    this.app.use(cors());

    // the mount point that the express server should build upon
    let baseMount = this.lucidServer.options.mount;

    this.metaRouter.get('/info', (req, res) => {
      res.json({});
    });

    // register handlers
    this.app.use(baseMount + 'meta', this.metaRouter);
    this.app.use(baseMount + 'custom', this.customRouter);

    /**
     * The HTTP server the express application is running on.
     * @type {http.Server}
     */
    this.httpServer = null;
  }

  /**
   * Attaches a HTTP server to the Express Server
   * @param {http.Server} httpServer the server to attach
   * @private
   */
  attach(httpServer) {
    let app = this.app;
    this.httpServer = httpServer;

    /*
      Get the HTTP server to let express handle requests
     */
    httpServer.on('request', app);
  }

};

export default LucidExpressServer;
