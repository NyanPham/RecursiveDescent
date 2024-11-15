const BNFParser = require("./src/BNFParser")
const Lexer = require("./src/Lexer")
const LexerError = require("./src/LexerError")

/* Testing the Lexer */
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
    console.log('\n\n')
} catch (err) {
    if (err instanceof LexerError) {
        console.log(`LexerError: ${err.message} at ${err.pos}`)
    } else{
        console.error(err)
    }
}

/* Testing the BNFParser */
const parser = new BNFParser()
const inputs = [
    '5 - 1 - 2',
    'set x = 5',
    'set y = 2 * x',
    '(5+y)*3 + 3'
]

inputs.forEach(input => {
    console.log(parser.parse(input))
})