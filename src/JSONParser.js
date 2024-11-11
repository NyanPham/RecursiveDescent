const ParseError = require("./ParseError");
const Parser = require("./Parser");

class JSONParser extends Parser {
    #acceptableChars = '0-9A-Za-z \t!$%&()*+./;<=>?^_`|!-'
    
    constructor() {
        super()
    }

    consumeWhitespace() {
        let isProcessingComment = false
        
        while (this.pos < this.len) {
            const char = this.text[this.pos + 1]
            if (isProcessingComment) {
                if (char === '\n') {
                    isProcessingComment = false
                }
            } else {
                if (char === '#') {
                    isProcessingComment = true 
                } else if (this.whitespaces.indexOf(char) == -1) {
                    break;
                }
            }

            this.incPos()
        }
    }

    start() {
        return this.match(['anyType'])
    }

    anyType() {
        return this.match(['complexType', 'primitiveType']) 
    }

    primitiveType() {
        return this.match(['null', 'boolean', 'quotedString', 'unquoted'])
    }

    complexType() {
        return this.match(['list', 'map'])
    }

    list() {
        const value = []

        this.keyword(['['])

        while (true) {
            const item = this.maybeMatch(['anyType'])

            if (item == null) {
                break
            }

            value.push(item)

            if (this.maybeKeyword([',']) == null) {
                break 
            }
        }

        this.keyword([']'])
        return value
    }

    map() {
        const value = {}

        this.keyword(['{'])

        while (true) {
            const item = this.maybeMatch(['pair'])

            if (item == null) {
                break
            }
            
            value[item[0]] = item[1]

            if (this.maybeKeyword([',']) == null) {
                break 
            }
        }

        this.keyword(['}'])

        return value
    }

    pair() {
        const key = this.match(['quotedString', 'unquoted'])

        if (typeof key !== 'string') {
            throw new ParseError(
                this.pos + 1,
                `Expected string but got ${typeof key}`,
                this.text[this.pos + 1]
            )
        }

        this.keyword([':'])
        const value = this.match(['anyType'])
        
        return [key, value]
    }

    null() {
        this.keyword(['null'])
        return null
    }

    boolean() {
        const bool = this.keyword(['true', 'false'])
        return bool === 'true'
    }   

    unquoted() {
        const chars = [this.char(this.#acceptableChars)]

        while (true) {
            const char = this.maybeChar(this.#acceptableChars)
            if (char == null) break 

            chars.push(char)
        }   

        const joined = chars.join("").trim()
        const value = Number(joined)

        if (isNaN(value)) return joined
        return value
    }

    quotedString() {
        const quote = this.char(`"'`)
        const chars = []

        const escapeSequences = {
            'b': '\b',
            'f': '\f',
            'n': '\n',
            'r': '\r',
            't': '\t'
        }

        while (true) {
            const char = this.char() 

            if (char === quote) {
                break 
            }

            if (char === '\\') {
                const escape = this.char()
                if (escape === 'u') {
                    const codePoint = []
                    for (let i = 0; i < 4; i++) {
                        codePoint.push(this.char('0-9a-fA-F'))
                    }   
                    
                    chars.push(String.fromCharCode(parseInt(codePoint.join(""), 16)))
                } else {
                    chars.push(escapeSequences[escape] ?? escape)
                }
            } else {
                chars.push(char)
            }
        }

        return chars.join("")
    }
}

module.exports = JSONParser