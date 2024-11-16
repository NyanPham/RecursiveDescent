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

- EBNFParser.js:
    Solved the operator associativity from pure BNF grammar. The issue of performance should be concerned as a single constant number must be through several precedence level to reach <factor>

- ShuntingYardParser:
    Attempt to improve performance by using the Shunting Yard algorithm to turn infix operator into postfix. 