const LexerError = require("./LexerError")
const Token = require("./Token")

/**
 * Lexer
 * @class Lexer
 */
class Lexer {
    #groupType = {}         // Maps regex group names to token types
    #regex = null           // Compiled regex for token matching
    #skipWhitespace = true  // Flag to indicate if whitespace should be skipped
    #reWsSkip = /\S/        // Regex to find the next non-whitespace character
    #text = null            // Input text to be tokenized
    #pos = 0                // Current position in the input text
    
    /**
     * Create a Lexer
     * @param {Object[]} rules - An array of objects, each with a `regex` and a `type` property
     * @param {boolean} [skipWhitespace=true] - Whether to skip over whitespace or not
     */
    constructor(rules, skipWhitespace = true) {
        const regexParts = []

        for (let i = 0; i < rules.length; i++) {
            const { regex, type } = rules[i]

            const groupName = `GROUP${i + 1}`
            regexParts.push(`(?<${groupName}>${regex})`)
            this.#groupType[groupName] = type
        }

        this.#regex = new RegExp(regexParts.join('|'))
        this.#skipWhitespace = skipWhitespace
    }

    /**
     * Set the input text to be tokenized
     * @param {string} text - The input text
     */
    set input(text) {
        this.#text = text
        this.#pos = 0
    }

    /**
     * Get the next token from the input text
     * @return {Token|null} The next token, or null if the end of the input text has been reached
     * @throws {LexerError} If no valid token can be found at the current position in the input text
     */
    token() {
        // Check if the current position is at or beyond the end of the text
        if (this.#pos >= this.#text.length) {
            return null; // Return null if end of input is reached
        }

        // If skipping whitespace, adjust position to the first non-whitespace character
        if (this.#skipWhitespace) {
            const match = this.#reWsSkip.exec(this.#text.slice(this.#pos));

            if (match) {
                this.#pos += match.index; // Move position forward to the first non-whitespace
            } else {
                return null; // Return null if only whitespace is left
            }
        }

        // Attempt to match a token starting from the current position
        const match = this.#regex.exec(this.#text.slice(this.#pos));

        if (match) {
            // Find the matching group with the longest value
            const groupName = Object.entries(match.groups).reduce(
                (longest, [name, value]) =>
                    value && value.length > longest.length ? { groupName: name, length: value.length } : longest,
                { groupName: null, length: 0 }
            ).groupName;

            // Retrieve token type from the group name
            const type = this.#groupType[groupName];
            // Create a new Token object with the matched type and value
            const tok = new Token(type, match.groups[groupName], this.#pos);

            this.#pos += match[0].length; // Advance position past the matched token
            return tok; // Return the new Token
        }

        // If no match, throw an error indicating invalid token
        throw new LexerError('Unexpected character at position', this.#pos);
    }
    
    /**
     * Returns an iterator that yields each token in the input text
     * @yields {Token} The next token in the input text
     * @throws {LexerError} If any invalid tokens are found in the input text
     */
    *tokens() {
        while (true) {
            const token = this.token()
            if (token == null) break;
            yield token
        }
    }
}

module.exports = Lexer