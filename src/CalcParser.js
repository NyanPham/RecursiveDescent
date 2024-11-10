const Parser = require("./Parser");

class CalcParser extends Parser {
    constructor() {
        super()
    }

    start() {
        return this.expression()
    }

    expression() {
        let value = this.match(['term'])

        while (true) {
            const op = this.maybeKeyword(['+', '-'])
            if (op == null) 
                break

            const operand = this.match(['term'])
            if (op === '+') value += operand
            else value -= operand
        }

        return value    
    }

    term() {
        let value = this.match(['factor'])
        while (true) {
            const op = this.maybeKeyword(['*', '/'])
            if (op == null) 
                break

            
            const operand = this.match(['factor'])
            if (op === '*') value *= operand
            else value /= operand
        }

        return value
    }   

    factor() {
        if (this.maybeKeyword(['('])) {
            const value = this.match(['expression'])
            this.keyword([')'])

            return value
        }

        return this.match(['number'])
    }

    number() {
        const digits = []

        const sign = this.maybeKeyword(['+', '-'])
        if (sign != null) {
            digits.push(sign)
        }

        digits.push(this.char('0-9'))

        while (true) {
            const moreDigit = this.maybeChar('0-9')
            if (moreDigit == null) 
                break

            digits.push(moreDigit)
        }

        if (this.maybeChar('.')) {
            digits.push('.')
            digits.push(this.char('0-9'))

            while (true) {
                const moreDigit = this.maybeChar('0-9')
                if (moreDigit == null) 
                    break

                digits.push(moreDigit)
            }
        }

        return parseFloat(digits.join(''))
    }
}   

module.exports = CalcParser