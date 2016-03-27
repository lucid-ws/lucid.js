'use strict';

/**
* Object containing options for ExpressServer
* @typedef {(object)} ExpressServerOptions
*/

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The LucidExpressServer handles HTTP REST requests for the Lucid Server, e.g. server metadata.
 */

var LucidExpressServer = function () {

  /**
   * Creates a new ExpressServer. Developers shouldn't instantiate this class themselves, it is done by LucidServer.
   * @param {LucidServer} lucidServer The Lucid Server that the ExpressServer is serving under.
   */

  function LucidExpressServer(lucidServer) {
    _classCallCheck(this, LucidExpressServer);

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
    this.app = (0, _express2.default)();

    /**
     * Express Router for managing core Lucid requests.
     * @type {express.Router}
     */
    this.metaRouter = _express2.default.Router();

    /**
     * Express Router for managing custom requests.
     * @type {express.Router}
     */
    this.customRouter = _express2.default.Router();

    // allow Cross-Origin Resource Sharing (external access to server)
    this.app.use((0, _cors2.default)());

    // the mount point that the express server should build upon
    var baseMount = this.lucidServer.options.mount;

    this.metaRouter.get('/info', function (req, res) {
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


  _createClass(LucidExpressServer, [{
    key: 'attach',
    value: function attach(httpServer) {
      var app = this.app;
      this.httpServer = httpServer;

      /*
        Get the HTTP server to let express handle requests
       */
      httpServer.on('request', app);
    }
  }]);

  return LucidExpressServer;
}();

;

exports.default = LucidExpressServer;
module.exports = exports['default'];