const CalcParser = require("./src/CalcParser");
const JSONParser = require("./src/JSONParser");
const ParseError = require("./src/ParseError");
const { catchErrorTyped } = require("./src/utils/catchErrorTyped");

const inputs = [
    '- 4 + 10',
    '3/0',
    'abcd',
    '(3 + 2) * 7',
    '100/2'
]   

const calcParser = new CalcParser()
    console.log("****************************************")

console.log("Calc Parser:\n") 
inputs.forEach(input => {
    const [error, value] = catchErrorTyped(() => {
        return calcParser.parse(input)
    }, [ParseError])

    if (error) {
        console.error(error.toString())
        return
    }

    console.log(`${input} = ${value}`)
})

console.log("****************************************")
console.log("JSON Parser:\n")

const jsonString = `
{
	# Comments begin with a '#' and continue till the end of line.

	# You can skip quotes on strings if they don't have hashes,
	# brackets or commas.
	Size: 1.5x,

	# Trailing commas are allowed on lists and maps.
	Things to buy: {
		Eggs : 6,
		Bread: 4,
		Meat : 2,
	},

	# And of course, plain JSON stuff is supported too!
	"Names": ["John", "Mary"],

	"Is the sky blue?": true,

    "Just some unicode": "\u21b4"
}`

const jsonParser = new JSONParser()
const [jsonError, jsonValue] = catchErrorTyped(() => {
    return jsonParser.parse(jsonString)
}, [ParseError])

if (jsonError) {
    console.error(jsonError.toString())
} else {
    console.log(JSON.stringify(jsonValue, null, 2))
}
