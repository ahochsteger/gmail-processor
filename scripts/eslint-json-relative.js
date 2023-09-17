"use strict"

/**
 * JSON ESlint formatter with relative paths.
 *
 * @param results - ESlint results
 * @param context - ESlint context
 * @returns Formatted JSON result with relative paths
 */
module.exports = function (results, context) {
  results.forEach((result) => {
    result.filePath = result.filePath.substring(context.cwd.length + 1)
  })
  return JSON.stringify(results, null, 2)
}
