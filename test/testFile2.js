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
const testFn2 = function (inputDataHere2) {
    return 'You gave me2: ' + JSON.stringify(inputDataHere2, undefined, 2);
};

module.exports = testFn2;
