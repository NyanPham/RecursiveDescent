# RecursiveDescent-Backtracking

# RecursiveDescentParser
- Lexer.js: 
    A lexer to tokenize a string into tokens

- BNFParser.js: 
    A simple parser based on BNF grammar. It has the problem operator associativity not working correctly. 
    Example:
        5 - 1 - 2 -> the parser applies the production rules <expression>: <term> - <expression> 
        5 -> <term>
        1 - 2 -> <expression>
    
        So it results in 5 - (1 - 2) = 5 - (-1) = 6
