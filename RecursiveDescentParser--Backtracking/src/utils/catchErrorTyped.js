exports.catchErrorTyped = (fn, errorsToCatch = null) => {
    try {
        const res = fn()
        return [null, res]
    } catch (error) {
        if (errorsToCatch == null) {
            return [error]
        }

        if (errorsToCatch.some(e => error instanceof e)) {
            return [error]
        }

        console.error(error)

        throw [new Error(`Unexpected error: ${error.message}`)];
    }
}