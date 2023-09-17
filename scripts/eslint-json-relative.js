"use strict"

/**
 * JSON ESlint formatter with relative paths.
 *
 * @param {array} results
 * @param {object} context
 * @returns {string}
 */
module.exports = function (results, context) {
  results.forEach((result) => {
    result.filePath = result.filePath.substring(context.cwd.length + 1)
  })
  return JSON.stringify(results, null, 2)
}
