/**
 * Describes a Client requesting a new session.
 * @type {Number}
 */
const CLIENT_NEW_SESSION_REQUEST = 1;

/**
 * Describes a Client requesting to return to an existing session.
 * @type {Number}
 */
const CLIENT_EXISTING_SESSION_REQUEST = 2;

/**
 * Describes when the server is going to disconnect a client.
 * @type {Number}
 */
const SERVER_DISCONNECTING_CLIENT = 3;

/**
 * Describes when a Server accepts a new/existing session request.
 * @type {Number}
 */
const SERVER_ACCEPT_SESSION_REQUEST = 4;

/**
 * @ignore
 */
export const PacketType = {
  CLIENT_NEW_SESSION_REQUEST,
  CLIENT_EXISTING_SESSION_REQUEST,
  SERVER_DISCONNECTING_CLIENT,
  SERVER_ACCEPT_SESSION_REQUEST,
};

/*
  DISCONNECT TYPES
*/

/**
 * DisconnectType - Describes when the Server is disconnecting/refusing the client as it is running at maximum capacity.
 * @type {Number}
 */
const SERVER_AT_MAXIMUM_CAPACITY = 1;

/**
 * DisconnectType - Describes when a Client opens a connection to the server, but takes too long to send an
 * authentication packet.
 * @type {Number}
 */
const TOOK_TOO_LONG_TO_AUTH = 2;

/**
 * @ignore
 */
export const DisconnectPacketType = {
  SERVER_AT_MAXIMUM_CAPACITY,
  TOOK_TOO_LONG_TO_AUTH,
};
