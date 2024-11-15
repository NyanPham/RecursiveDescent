const Lexer = require("./Lexer");
const LexerError = require("./LexerError");
const ParseError = require("./ParseError");
const Token = require("./Token");

class EBNFParser {
    #lexRules = [
        {
            regex: 'set',
            type: 'SET'
        },
        {
            regex:'\\d+',
            type: 'NUMBER'
        },
        {
            regex: '[a-zA-Z_]\\w*',
            type: 'IDENTIFIER'
        },
        {
            regex: '\\+',
            type: '+'
        },
        {
            regex: '\\-',
            type: '-'
        },
        {
            regex: '\\*',
            type: '*'
        },
        {
            regex: '\\/',
            type: '/'
        },
        {
            regex: '\\*\\*',
            type: '**'
        },
        {
            regex: '\\(',
            type: '('
        },
        {
            regex: '\\)',
            type: ')'
        },
        {
            regex: '=',
            type: '='
        }
    ]
    #lexer
    #curToken
    #varTable 
    constructor() {
        this.#lexer = new Lexer(this.#lexRules, true)
        this.clear()
    }

    parse(text) {
        this.#lexer.input = text
        this.getNextToken()
        return this.statement()
    }

    clear() {
        this.#curToken = null 
        this.#varTable = {}
    }

    error(msg) {
        throw new ParseError(msg)
    }

    getNextToken() {
        try {
            this.#curToken = this.#lexer.token()
            if (this.#curToken == null) {
                this.#curToken = new Token(null, null, null)
            }
        } catch (err) {
            if (err instanceof LexerError) {
                this.error(`Lexer error at position ${err.pos}`)
            } else {
                console.error(err)
            }
        }
    }

    match(type) {
        if (this.#curToken.type == type) {
            const value = this.#curToken.value
            this.getNextToken()
            return value;
        } else {
            this.error(`Unmatched ${type}`)
        }
    } 


    /*
        <statement> : set <identifier> = <expression> | <experession>
    */
    statement() {
        if (this.#curToken.type == null) {
            return '' 
        } 

        if (this.#curToken.type == 'SET') {
            this.match('SET') 
            const identifer = this.match('IDENTIFIER')
            this.match('=')
            const expressionValue = this.expression()

            this.#varTable[identifer] = expressionValue

            return expressionValue
        }

        return this.expression()
    }

    /*
        <expression> : <term> { + <term> | - <term> }
    */
    expression() {
        let left = this.term()

        while (this.#curToken.type == '+' || this.#curToken.type == '-') {
            if (this.#curToken.type == '+') {
                this.match('+')
                left = left + this.term()
            } else {
                this.match('-')
                left = left - this.term()                
            }
        }

        return left
    }   

    /*
        <term> : <power> { * <power> | / <power> }
    */
    term() {
        let left = this.power()
        
        while (this.#curToken.type == '*' || this.#curToken.type == '/') {
            if (this.#curToken.type == '*') {
                this.match('*')
                left *= this.power()
            } else {
                this.match('/')
                left /= this.power()
            }
        }

        return left
    }

    /*
        <power> : <factor> { **<power> }
    */
    power() {
        let left = this.factor()

        if (this.#curToken.type == '**') {
            this.match('**')
            left = left ** this.power()
        }
        
        return left
    }

    /*
        <factor> : <identifier> | <number> | (<expression>) 
    */  
    factor() {
        if (this.#curToken.type == '(') {
            this.match('(')
            const value = this.expression()
            this.match(')')
            return value
        } else if (this.#curToken.type == 'NUMBER') {
            return Number(this.match('NUMBER'))
        } else if (this.#curToken.type == 'IDENTIFIER') {
            const identifier = this.match('IDENTIFIER')

            const value = this.#varTable[identifier]
            if (value == null) {
                this.error(`Unknown identifer \`${identifier}\``)
            }

            return value
        } else  {
            this.error(`Invalid factor ${this.#curToken.value}`)
        }
    }
}

module.exports = EBNFParser