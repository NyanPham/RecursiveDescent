const Lexer = require("./Lexer");
const LexerError = require("./LexerError");
const Op = require("./Op");
const ParseError = require("./ParseError");
const Token = require("./Token");
const lexRules = require('./lexRules')

class ShuntingYardParser {
    #lexRules = lexRules
    #lexer
    #curToken
    #varTable 
    #opStack = []
    #resultStack = []
    #ops = {
        '+': new Op({ name: '+', op: (a, b) => a + b, prec: 40 }),
        '-': new Op({ name: '-', op: (a, b) => a - b, prec: 40 }),
        '*': new Op({ name: '*', op: (a, b) => a * b, prec: 50 }),
        '/': new Op({ name: '/', op: (a, b) => a / b, prec: 50 }),
        '**': new Op({ name: '**', op: (a, b) => a ** b, prec: 60, rightAssociative: true }),
    }
    #sentinal = new Op({ name: null, op: null, prec: 0 }) 

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
        this.#opStack = []
        this.#resultStack = []
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

    statement() {
        if (this.#curToken.type == null) {
            return '' 
        } 

        if (this.#curToken.type == 'SET') {
            this.match('SET') 
            const identifier = this.match('IDENTIFIER')
            this.match('=')
            const expressionValue = this.infixEval()

            this.#varTable[identifier] = expressionValue
            return expressionValue
        }

        return this.infixEval()
    }   

    infixEval() {
        this.#opStack.length = 0
        this.#resultStack.length = 0

        this.#opStack.push(this.#sentinal)
        this.infixEvalExpression()
        return this.#resultStack.at(-1)
    }

    infixEvalExpression() {
        this.infixEvalAtom()

        while (this.#ops[this.#curToken.type]?.binary)  {
            this.pushOp(this.#ops[this.#curToken.type])
            this.getNextToken()
            this.infixEvalAtom()
        }

        while (this.#opStack.at(-1) != this.#sentinal) {
            this.popOp()
        }
    }       

    infixEvalAtom() {
        if (this.#curToken.type == 'IDENTIFIER' || this.#curToken.type == 'NUMBER') {
            this.#resultStack.push(this.computeValue(this.#curToken))
            this.getNextToken()
        } else if (this.#curToken.type == '(') {
            this.getNextToken()
            this.#opStack.push(this.#sentinal)
            this.infixEvalExpression()
            this.match(')')
            this.#opStack.pop()
        } else {
            throw new ParseError(`Invalid factor ${this.#curToken.value}`)
        }
    }   
    
    pushOp(op) {
        while (this.#opStack.at(-1)?.precedes(op)) {
            this.popOp()
        }

        this.#opStack.push(op)
    }

    popOp() {
        const topOp = this.#opStack.pop()

        if (topOp.unary) {
            this.#resultStack.push(topOp.apply(this.#resultStack.pop()))
        } else {
            if (this.#resultStack.length < 2) {
                this.error(`Not enough arguments for operator ${topOp.name}`)
                return 
            } 
            
            const t1 = this.#resultStack.pop()
            const t0 = this.#resultStack.pop()
        
            this.#resultStack.push(topOp.apply(t0, t1))
        }
    }

    computeValue(tok) {
        switch (tok.type) {
            case 'NUMBER':  
                return Number(tok.value)
            case 'IDENTIFIER':
                if (this.#varTable[tok.value] == null) {
                    this.error(`Unknown identifer \`${tok.value}\``)
                    break 
                } else {
                    return this.#varTable[tok.value]
                }
            default:
                this.error(`Invalid factor ${tok.value}`)
        }
    }
}

module.exports = ShuntingYardParser