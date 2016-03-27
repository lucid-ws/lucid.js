"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Describes a Client requesting a new session.
 * @type {Number}
 */
var CLIENT_NEW_SESSION_REQUEST = 1;

/**
 * Describes a Client requesting to return to an existing session.
 * @type {Number}
 */
var CLIENT_EXISTING_SESSION_REQUEST = 2;

/**
 * Describes when the server is going to disconnect a client.
 * @type {Number}
 */
var SERVER_DISCONNECTING_CLIENT = 3;

/**
 * Describes when a Server accepts a new/existing session request.
 * @type {Number}
 */
var SERVER_ACCEPT_SESSION_REQUEST = 4;

/**
 * @ignore
 */
var PacketType = exports.PacketType = {
  CLIENT_NEW_SESSION_REQUEST: CLIENT_NEW_SESSION_REQUEST,
  CLIENT_EXISTING_SESSION_REQUEST: CLIENT_EXISTING_SESSION_REQUEST,
  SERVER_DISCONNECTING_CLIENT: SERVER_DISCONNECTING_CLIENT,
  SERVER_ACCEPT_SESSION_REQUEST: SERVER_ACCEPT_SESSION_REQUEST
};

/*
  DISCONNECT TYPES
*/

/**
 * DisconnectType - Describes when the Server is disconnecting/refusing the client as it is running at maximum capacity.
 * @type {Number}
 */
var SERVER_AT_MAXIMUM_CAPACITY = 1;

/**
 * DisconnectType - Describes when a Client opens a connection to the server, but takes too long to send an
 * authentication packet.
 * @type {Number}
 */
var TOOK_TOO_LONG_TO_AUTH = 2;

/**
 * @ignore
 */
var DisconnectPacketType = exports.DisconnectPacketType = {
  SERVER_AT_MAXIMUM_CAPACITY: SERVER_AT_MAXIMUM_CAPACITY,
  TOOK_TOO_LONG_TO_AUTH: TOOK_TOO_LONG_TO_AUTH
};