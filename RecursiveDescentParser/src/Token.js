/**
 * Token class
 * @class
 */
class Token {
    /**
     * Create a Token
     * @param {string} type - Token type
     * @param {string} value - Token value
     * @param {number} pos - Position of token in input
     */
    constructor(type, value, pos) {
        this.type = type
        this.value = value
        this.pos = pos
    }   

    /**
     * Get string representation of token
     * @return {string} string representation of token
     */
    toString() {
        return `${this.type}(${this.value}) at ${this.pos}`
    }
}

module.exports = Token
