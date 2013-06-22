/**
 *
 * @param {string} str
 * @returns {string}
 */
function capitalizeFirst(str) {
    return str? str.charAt(0).toUpperCase() + str.slice(1) : '';
}