'use strict';

import * as Lucid from '../../';
import http from 'http';
import WebSocket from 'ws';

/**
 * @ignore
 */
const lucid = new Lucid.Server.LucidServer();

/**
 * @ignore
 */
const server = http.createServer();

lucid.attach(server);

server.listen(25543);

/**
 * @ignore
 */
const h = new WebSocket('ws://localhost:25543/ws');

h.onopen = e => {

};

h.onmessage = e => {
  console.log(e.data);
};
