'use strict';

/**
 * Merge a nested default options object with a custom object.
 * @param {Object} def default object
 * @param {Object} custom custom object to fill in missing properties with values from the default object.
 * @ignore
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Options = exports.Options = function merge(def, given) {
  if (!given) return def;

  given = given || {};

  for (var key in def) {
    if (!given.hasOwnProperty(key)) {
      given[key] = def[key];
    } else if (given[key] === Object(given[key])) {
      given[key] = merge(def[key], given[key]);
    }
  }

  return given;
};