const Lexer = require("./src/Lexer")
const LexerError = require("./src/LexerError")

const rules = [
    {
        regex: '\\d+',
        type: 'NUMBER'
    },
    {
        regex: '[a-zA-Z_]\\w+',
        type: 'IDENTIFIER'
    },
    {
        regex: '\\+',
        type: 'PLUS'
    },
    {
        regex: '-',
        type: 'MINUS'
    },
    {
        regex: '\\*',
        type: 'MULTIPLY'
    },
    {
        regex: '/',
        type: 'DIVIDE'
    },
    {
        regex: '\\(',
        type: 'LP'
    },
    {
        regex: '\\)',
        type: 'RP'
    },
    {
        regex: '=',
        type: 'EQUALS'
    }
]

const lexer = new Lexer(rules, true)
lexer.input = 'erw = _abc + 12*(R4-623902)  '

try {
    for (const tok of lexer.tokens()) {
        console.log(tok.toString())
    }
} catch (err) {
    if (err instanceof LexerError) {
        console.log(`LexerError: ${err.message} at ${err.pos}`)
    } else{
        console.error(err)
    }
}

