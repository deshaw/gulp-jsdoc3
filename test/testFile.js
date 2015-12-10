/**
 * Test File is a file for testing documenation!
 *
 * @module JSDocTesting
 */

/**
 * An amazing test function
 *
 * @param {Object} inputDataHere an object you'd like to see as a string
 * @returns {string}
 *
 */
const testFn = function (inputDataHere) {
    return 'You gave me: ' + JSON.stringify(inputDataHere, undefined, 2);
};

module.exports = testFn;
