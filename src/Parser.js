const ParseError = require("./ParseError");
const { catchErrorTyped } = require("./utils/catchErrorTyped");

class Parser {
    #cache = {}
    #text = null
    #pos = null
    #len = null 
    #whitespaces = ' \f\v\r\t\n'

    constructor() {}

    start() {
        // throw new Error("Not implemented")
    }

    parse(text) {
        this.setUp(text)
        const parsedValue = this.start()
        this.assertEnd()
        return parsedValue
    }

    setUp(text) {
        this.#text = text
        this.#pos = -1
        this.#len = text.length - 1
    }

    getPos() {
        return this.#pos
    }

    assertEnd() {
        if (this.#pos < this.#len) {
            throw new ParseError(this.#pos + 1, "Expected end of input but got <MSG_ARG>", this.#text[this.#pos + 1]);
        }
    }

    consumeWhitespace() {
        while (this.#pos < this.#len && this.#whitespaces.indexOf(this.#text[this.#pos + 1]) !== -1) {
            this.#pos += 1
        }
    }

    splitCharRanges(chars) {
        if (this.#cache[chars] != null) {
            return this.#cache[chars]
        }

        const values = []
        let idx = 0
        const charsLen = chars.length

        while (idx < charsLen) {
            if (idx + 2 < charsLen && chars[idx + 1] === '-') {
                if (chars[idx] >= chars[idx + 2]) {
                    throw new Error(`Invalid character range ${chars[idx]}-${chars[idx + 2]}`)
                }

                values.push(chars.slice(idx, idx + 3));
                idx += 3
            } else {
                values.push(chars[idx]);
                idx += 1
            }
        }

        this.#cache[chars] = values 
        return values
    } 

    char(chars = null) {
        if (this.#pos >= this.#len) {
            throw new ParseError(this.#pos + 1, 'Expected <MSG_ARG> but got end of input', chars == null ? 'character' : `[${chars}]`);
        }

        const nextChar = this.#text[this.#pos + 1]

        if (chars == null) {
            this.#pos += 1
            return nextChar
        }

        for (const charRange of this.splitCharRanges(chars)) {
            if (charRange.length === 1) {
                if (charRange[0] === nextChar) {
                    this.#pos += 1
                    return nextChar
                }
            } else if (charRange[0] <= nextChar <= charRange[2]) {
                this.#pos += 1
                return nextChar
            }
        }

        throw new ParseError(this.#pos + 1, 'Expected <MSG_ARG> but got <MSG_ARG>', chars == null ? 'character' : `[${chars}]`, nextChar);
    }

    keyword(keywords = []) {
        this.consumeWhitespace()

        if (this.#pos >= this.#len) {
            throw new ParseError(this.#pos + 1, 'Expected <MSG_ARG> but got end of input', keywords.join(', '));
        }

        for (const keyword of keywords) {
            const sIdx = this.#pos + 1
            const eIdx = sIdx + keyword.length

            if (eIdx > this.#len) {
                throw new ParseError(this.#pos + 1, 'Expected <MSG_ARG> but got end of input', keywords.join(', '));
            }

            if (this.#text.slice(sIdx, eIdx) === keyword) {
                this.#pos += keyword.length
                this.consumeWhitespace()
                return keyword
            }
        }

        throw new ParseError(this.#pos + 1, 'Expected <MSG_ARG> but got <MSG_ARG>', keywords.join(', '), this.#text[this.#pos + 1]);
    }

    match(rules = []) {
        this.consumeWhitespace()
        let lastErrorPos    = -1,
            lastError       = null,
            lastErrorRules  = [],
            initialPos      = -1

        for (const rule of rules) {
            initialPos = this.#pos

            const [error, value] = catchErrorTyped(() => {
                const res = this[rule]()
                this.consumeWhitespace()

                return res
            }, [ParseError])

            if (error != null) {
                this.#pos = initialPos

                if (error.pos > lastErrorPos) {
                    lastError = error
                    lastErrorPos = error.pos
                    lastErrorRules = [rule] 
                } else if (error.pos === lastErrorPos) {
                    lastErrorRules.push(rule)
                }

                continue
            }

            if (value != null) return value
        }

        if (lastErrorRules.length === 1) {
            throw lastError
        } else {
            throw new ParseError(lastErrorPos, 'Expected <MSG_ARG> but got <MSG_ARG>', lastErrorRules.join(', '), this.#text[lastErrorPos]);
        }
    }

    maybeChar(chars = null) {
        const [error, value] = catchErrorTyped(() => {
            return this.char(chars)
        }, [ParseError])

        if (error != null) return null
        return value
    }

    maybeKeyword(keywords = []) {
        const [error, value] = catchErrorTyped(() => {
            return this.keyword(keywords)
        }, [ParseError])
        
        if (error != null) return null
        return value
    }

    maybeMatch(rules = []) {
        const [error, value] = catchErrorTyped(() => {
            return this.match(rules)
        }, [ParseError])

        if (error != null) return null
        return value
    }
}

module.exports = Parser