import * as PacketConstants from './packets/Packets';
import * as ErrorConstants from './errors/Errors';

/**
 * The Lucid Protocol version that the server and client are running.
 * @type {String}
 */
export const ProtocolVersion = 'alpha-experimental-1';

/**
 * Describes the state of the Server.
 * @type {Object}
 * @property {Number} AVAILABLE Shows that the server is ready/available.
 * @property {Number} UNAVAILABLE Shows that the server is unavailable and is not attempting to start/restart.
 * @property {Number} RESTARTING Shows that the server is unavailable but is trying to restart.
 * @property {Number} STARTING Shows that the server is starting up for the first time.
 */
export const ServerStatus = {
  AVAILABLE: 0,
  UNAVAILABLE: 1,
  RESTARTING: 2,
  STARTING: 3,
};

/**
 * Describes the state of a Client.
 * @type {Object}
 * @property {Number} ACTIVE Shows that the Client is active - it is connected.
 * @property {Number} INACTIVE Shows that the Client is inactive - it is disconnected, but has the chance
 * to renew its session. Clients may be inactive when their connection has dropped.
 * @property {Number} REMOVED Shows that the Client is disconnected and they are not permitted to return to their
 * session.
 * @property {Number} UNAUTHORIZED Shows that the Client is unauthorized. Only applies to UnknownClient.
 */
export const ClientStatus = {
  ACTIVE: 0,
  INACTIVE: 1,
  REMOVED: 2,
  UNAUTHORIZED: 3,
};

/**
 * Default options for a Server's setup.
 * @type {ServerOptions}
 */
export const ServerDefaultOptions = {
  wss: {
    allowedAuthTime: 1000,
  },
  express: {},
  mount: '/',
  maxClients: 25,
};

/*

 PACKETS

 */
/**
 * Object containing Packet Types
 * @type {Object}
 */
export const PacketTypes = PacketConstants.PacketType;

/**
 * Object containing Disconnect Packet Types
 * @type {Object}
 */
export const DisconnectTypes = PacketConstants.DisconnectPacketType;

/*

 ERRORS

 */
/**
 * Object containing Error Types
 * @type {Object}
 */
export const Errors = ErrorConstants.Errors;
