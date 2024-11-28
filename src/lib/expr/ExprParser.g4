parser grammar ExprParser;
options {
    language=TypeScript;
    tokenVocab=ExprLexer;
}

/* Templates */
template: templatePart* EOF;
templatePart: text | expr | legacyExpr;
text: TEXT;

/* Expressions */
expr:
    XPSTART
    dataRefName
    filterChain?
    XPEND
    ;
dataRefName: refObjectName refAttrName;
refObjectName: ID;
refAttrName: (DOT (ID | IntegerLiteral))+;
filterChain: ( PIPE filterExpr )+;
filterExpr: filterName LPAREN filterArgs? RPAREN;
filterName: ID;
filterArgs: filterArg (COMMA filterArg)*;
filterArg: BooleanLiteral | IntegerLiteral | STRING;

/* Legacy Expressions */
legacyExpr:
    LEGACY_XPSTART
    legacyDataRefName
    (
        LEGACY_COLON
        legacyPlaceholderExpr
    )?
    ( LEGACY_EXPR_XPEND | LEGACY_PLACEHOLDER_XPEND | LEGACY_ARGS_XPEND)
    ;
legacyDataRefName: legacyRefObjectName legacyRefAttrName;
legacyRefObjectName: LEGACY_ID;
legacyRefAttrName: (
        LEGACY_DOT
        (LEGACY_ID | LegacyIntegerLiteral)
    )+
    ;
legacyPlaceholderExpr
    : (
        LegacyPlaceHolderModifierDate
        | LegacyPlaceholderModifierFormat
        | LegacyPlaceholderModifierJoin
        | LegacyPlaceHolderModifierOffsetFormat
    )
    (
        LEGACY_ARGS_COLON
        LegacyPlaceholderArgs
    )?
    ;
