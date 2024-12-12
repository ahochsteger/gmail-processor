lexer grammar ExprLexer;
tokens { STRING }

TEXT: 
    (
        ~[{$]
        | '{' ~'{'
        | '$' ~'{'
    )+
    | '$' EOF
    | '{' EOF
    ;
XPSTART : '{{' -> mode(EXPR_MODE);
LEGACY_XPSTART : '${' -> mode(LEGACY_EXPR_MODE);
WS     : [ \r\t\n]+    -> skip ;

mode EXPR_MODE;
    XPEND : '}}' -> mode(DEFAULT_MODE);
    PIPE : WS* '|' WS* ;
    COMMA : ',' ;
    LPAREN : WS* '(' WS* ;
    RPAREN : WS* ')' WS* ;
    DOT: '.' ;
    ID: [a-z][a-zA-Z0-9_]* ;
    BooleanLiteral: 'true' | 'false';
    IntegerLiteral: '0' | [1-9][0-9]* ;
    StringLiteral:
        (
            '"' ('\\' [\\'"bfnrtv] | ~["\\\r\n])*? '"'
            | '\'' ('\\' [\\'"bfnrtv] | ~['\\\r\n])*? '\''
        ) -> type(STRING)
    ;

mode LEGACY_EXPR_MODE;
    LEGACY_COLON: ':' -> mode(LEGACY_PLACEHOLDER_MODE);
    LEGACY_DOT: '.' ;
    LEGACY_ID: [a-z][a-zA-Z0-9_]* ;
    LegacyIntegerLiteral: '0' | [1-9][0-9]* ;
    LEGACY_EXPR_XPEND : '}' -> mode(DEFAULT_MODE);

mode LEGACY_PLACEHOLDER_MODE;
    LegacyPlaceHolderModifierDate: 'date' ;
    LegacyPlaceholderModifierFormat: 'format' ;
    LegacyPlaceholderModifierJoin: 'join' ;
    LegacyPlaceHolderModifierOffsetFormat: 'offset-format' ;
    LEGACY_ARGS_COLON : ':' -> mode(LEGACY_ARGS_MODE);
    LEGACY_PLACEHOLDER_XPEND : '}' -> mode(DEFAULT_MODE);

mode LEGACY_ARGS_MODE;
    LEGACY_ARGS_XPEND : '}' -> mode(DEFAULT_MODE);
    LegacyPlaceholderArgs: ~[}]+ ;
