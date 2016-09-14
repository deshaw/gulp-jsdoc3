/**
 * Test File is a file for testing documenation!
 *
 * @module JSDocTesting
 */

/**
 * An amazing test function
 *
 * @param {Object} anotherParameter an object you'd like to see as a string
 * @returns {string}
 *
 */
const testFn2 = function (anotherParameter) {
    return 'You gave me2: ' + JSON.stringify(anotherParameter, undefined, 2);
};

module.exports = testFn2;
