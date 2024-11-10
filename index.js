const CalcParser = require("./src/CalcParser");
const ParseError = require("./src/ParseError");
const { catchErrorTyped } = require("./src/utils/catchErrorTyped");

const inputs = [
    '- 4 + 10',
    '3/0',
    'abcd',
    '(3 + 2) * 7',
    '100/2'
]   

const parser = new CalcParser()

inputs.forEach(input => {
    const [error, value] = catchErrorTyped(() => {
        return parser.parse(input)
    }, [ParseError])
    
    if (error) {
        console.error(error.toString())
        return
    }

    console.log(`${input} = ${value}`)
})