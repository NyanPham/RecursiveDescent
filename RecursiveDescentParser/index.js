const BNFParser = require("./src/BNFParser")
const EBNFParser = require("./src/EBNFParser")
const Lexer = require("./src/Lexer")
const LexerError = require("./src/LexerError")
const ShuntingYardParser = require("./src/ShutingYardParser")

/* Testing the Lexer */
// console.log('LEXER:\n')
// const rules = [
//     {
//         regex: '\\d+',
//         type: 'NUMBER'
//     },
//     {
//         regex: '[a-zA-Z_]\\w+',
//         type: 'IDENTIFIER'
//     },
//     {
//         regex: '\\+',
//         type: 'PLUS'
//     },
//     {
//         regex: '-',
//         type: 'MINUS'
//     },
//     {
//         regex: '\\*',
//         type: 'MULTIPLY'
//     },
//     {
//         regex: '/',
//         type: 'DIVIDE'
//     },
//     {
//         regex: '\\(',
//         type: 'LP'
//     },
//     {
//         regex: '\\)',
//         type: 'RP'
//     },
//     {
//         regex: '=',
//         type: 'EQUALS'
//     }
// ]

// const lexer = new Lexer(rules, true)
// lexer.input = 'erw = _abc + 12*(R4-623902)  '

// try {
//     for (const tok of lexer.tokens()) {
//         console.log(tok.toString())
//     }
//     console.log('\n\n')
// } catch (err) {
//     if (err instanceof LexerError) {
//         console.log(`LexerError: ${err.message} at ${err.pos}`)
//     } else{
//         console.error(err)
//     }
// }

/* Testing the Parsers */
const inputs = [
    '5 - 1 - 2',
    'set x = 5',
    'set y = 2 * x',
    '(5+y)*3 + 3'
]

// console.log('BNF PARSER:\n')
// const bnfParser = new BNFParser()
// inputs.forEach(input => {
//     console.log(bnfParser.parse(input))
// })

// console.log('EBNF PARSER:\n')
// const ebnfParser = new EBNFParser()
// inputs.forEach(input => {
//     console.log(ebnfParser.parse(input))
// })

console.log('PARSER with Shunting Yard Algorithm:\n')
const stParser = new ShuntingYardParser()
inputs.forEach(input => {
    console.log(stParser.parse(input))
})