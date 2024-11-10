class ParseError extends Error {
    constructor(pos, msg, ...args) {
        super(msg);
        this.pos = pos
        this.msg = msg
        this.args = args
        this.name = "ParseError";
    }

    toString() {
        const msg = this.msg.replace(/<MSG_ARG>/g, () => {
            return this.args.shift();
        });
        
        return `${msg} at position ${this.position}`
    }
}

module.exports = ParseError;