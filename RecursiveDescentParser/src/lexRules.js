module.exports = [
    {
        regex: 'set',
        type: 'SET'
    },
    {
        regex:'\\d+',
        type: 'NUMBER'
    },
    {
        regex: '[a-zA-Z_]\\w*',
        type: 'IDENTIFIER'
    },
    {
        regex: '\\+',
        type: '+'
    },
    {
        regex: '\\-',
        type: '-'
    },
    {
        regex: '\\*',
        type: '*'
    },
    {
        regex: '\\/',
        type: '/'
    },
    {
        regex: '\\*\\*',
        type: '**'
    },
    {
        regex: '\\(',
        type: '('
    },
    {
        regex: '\\)',
        type: ')'
    },
    {
        regex: '=',
        type: '='
    }
]