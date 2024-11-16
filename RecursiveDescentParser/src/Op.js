
class Op {
    /**
     * Constructs an operator object.
     * @param {Object} config - The configuration object for the operator.
     * @param {string} config.name - The name of the operator.
     * @param {Function} config.op - The function implementing the operator logic.
     * @param {number} config.prec - The precedence level of the operator.
     * @param {boolean} [config.unary=false] - Whether the operator is unary.
     * @param {boolean} [config.rightAssociative=false] - Whether the operator is right associative.
     */
    constructor({ name, op, prec, unary=false, rightAssociative=false }) {
        this.name = name
        this.op = op
        this.prec = prec
        this.binary = !unary
        this.unary = unary
        this.leftAssociative = !rightAssociative
        this.rightAssociative = rightAssociative
    }
    
    /**
     * Applies the operator to the given arguments.
     * @param {...number} args - the arguments to the operator
     * @returns {number} the result of applying the operator
     */
    apply(...args) {
        return this.op(...args)
    }
    
    /**
     * Determines whether this operator should be applied before the given operator.
     * @param {Op} other - the operator to compare to
     * @returns {boolean} whether this operator should be applied before the given operator
     */ 
    precedes(other) {
        if (this.binary && other.binary) {
            if (this.prec > other.prec) return true
            else if (this.leftAssociative && this.prec == other.prec) return true
        } else if (this.unary && other.binary) {
            return this.prec >= other.prec
        }

        return false
    }
}

module.exports = Op