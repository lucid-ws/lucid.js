/**
 * Thrown when the client send an incorrect message i.e. bad compression or bad json
 * @type {Error}
 */
const INVALID_MESSAGE_FROM_CLIENT = new Error(
  'The received message was of an invalid format i.e. bad compression or json');

/**
 * Object containing custom errors
 * @type {Object}
 * @ignore
 */
export const Errors = {
  INVALID_MESSAGE_FROM_CLIENT,
};
