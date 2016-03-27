'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Thrown when the client send an incorrect message i.e. bad compression or bad json
 * @type {Error}
 */
var INVALID_MESSAGE_FROM_CLIENT = new Error('The received message was of an invalid format i.e. bad compression or json');

/**
 * Object containing custom errors
 * @type {Object}
 * @ignore
 */
var Errors = exports.Errors = {
  INVALID_MESSAGE_FROM_CLIENT: INVALID_MESSAGE_FROM_CLIENT
};