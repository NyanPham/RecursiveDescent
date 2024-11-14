/**
 * LexerError class
 * @class
 */
class LexerError extends Error {
    /**
     * Constructor for LexerError
     * @param {string} message - The error message
     * @param {number} pos - The position of the error
     */
    constructor(message, pos) {
        super(message)
        this.pos = pos
    }
}

module.exports = LexerError
