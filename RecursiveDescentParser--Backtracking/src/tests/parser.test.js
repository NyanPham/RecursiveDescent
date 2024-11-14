const Parser = require("../Parser");

it('Should assert error when expecting end of input but got char', () => {
    const parser = new Parser()
    const input = 'a'

    expect(() => parser.parse(input)).toThrowError()
});

it('Should match the end of input', () => {
    const parser = new Parser()
    const input = ''
        
    expect(parser.parse(input)).toEqual(undefined)
})

it('Should consume whitespace', () => {
    const parser = new Parser()
    const input = `\n \t\f\vI love you`   

    parser.setUp(input)
    parser.consumeWhitespace()
    expect(parser.getPos()).toEqual(4)
})

it('Should split character ranges', () => {
    const parser = new Parser()
    const input = 'a-zA-Z0-9_'
    const expectedOutput = ['a-z', 'A-Z', '0-9', '_']

    parser.setUp(input)
    expect(parser.splitCharRanges(input)).toEqual(expectedOutput)
})

it('Should assert error when character range is invalid', () => {
    const parser = new Parser()
    const input = 'a-zZ-W0-9_'

    parser.setUp(input)
    expect(() => parser.splitCharRanges(input)).toThrowError()
})
