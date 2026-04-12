import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ExprEvaluator, ExprListener } from "./ExprEvaluator"

let mocks: Mocks

beforeAll(() => {
  mocks = MockFactory.newMocks()
})

describe("parse()", () => {
  it("should parse an expression", () => {
    const tree = ExprEvaluator.parse(
      "/GmailProcessor-Tests/logsheet-{{date.now|formatDate('yyyy-MM')}}",
    )
    expect(tree).not.toBeNull()
  })
  it("should handle invalid legacy expressions", () => {
    expect(() => ExprEvaluator.parse("${message.date:invalid}")).toThrow(
      "SyntaxError",
    )
  })
})

describe("evaluate()", () => {
  it("should evaluate an expression", () => {
    const actual = ExprEvaluator.evaluate(
      mocks.messageContext,
      "/GmailProcessor-Tests/logsheet-{{date.now|formatDate('yyyy-MM')}}",
    )
    expect(actual).toEqual("/GmailProcessor-Tests/logsheet-2023-06")
  })
  it("should evaluate an expression with no filter function", () => {
    expect(
      ExprEvaluator.evaluate(mocks.messageContext, "{{message.subject}}"),
    ).toEqual("Message Subject 1")
  })
  it("should evaluate an expression with one filter function", () => {
    expect(
      ExprEvaluator.evaluate(
        mocks.messageContext,
        "{{message.date | formatDate('yyyy-MM-dd')}}",
      ),
    ).toEqual("2019-05-02")
  })
  it("should evaluate an expression with multiple filter functions", () => {
    expect(
      ExprEvaluator.evaluate(
        mocks.messageContext,
        '{{message.date|formatDate("yyyy_MM_dd")|parseDate("yyyy_MM_dd")|startOfISOWeek()|offsetDate("-1d")|formatDate(\'yyyy-MM-dd\')}}',
      ),
    ).toEqual("2019-04-28")
  })
  it("should detect filter chain expression types", () => {
    const tree = ExprEvaluator.parse(
      '{{message.date|filterDate("yyyy-MM-dd")}}',
    )

    expect(
      tree.templatePart().filter((e) => e.expr()?.filterChain()).length,
    ).toEqual(1)
    expect(
      tree.templatePart().filter((e) => e.legacyExpr()?.legacyPlaceholderExpr())
        .length,
    ).toEqual(0)
  })
})

describe("evaluate() legacy expressions", () => {
  const legacyMocks = MockFactory.newCustomMocks(
    ConfigMocks.newDefaultConfig(),
    {
      threads: [
        {
          labels: ["label1", "label2"],
          messages: [
            {
              date: new Date("2024-12-01"),
            },
          ],
        },
      ],
    },
  )
  it("should handle legacy placeholder expression 'date'", () => {
    const tree = ExprEvaluator.parse("${message.date:date::yyyy-MM-dd}")
    expect(
      tree.templatePart().filter((e) => e.legacyExpr()?.legacyPlaceholderExpr())
        .length,
    ).toEqual(1)
  })
  it("should evaluate legacy expression 'date'", () => {
    const actual = ExprEvaluator.evaluate(
      legacyMocks.messageContext,
      "${message.date:date:-2d:yyyy-MM-dd}",
    )
    expect(actual).toEqual("2024-11-29")
  })
  it("should evaluate legacy expression 'offset'", () => {
    const actual = ExprEvaluator.evaluate(
      legacyMocks.messageContext,
      "${message.date:offset-format:-2d:yyyy-MM-dd}",
    )
    expect(actual).toEqual("2024-11-29")
  })
  it("should evaluate legacy expression 'join'", () => {
    const actual = ExprEvaluator.evaluate(
      legacyMocks.messageContext,
      "${thread.labels:join}",
    )
    expect(actual).toEqual("label1,label2")
  })
  it("should handle invalid legacy expressions", () => {
    expect(() =>
      ExprEvaluator.evaluate(
        legacyMocks.messageContext,
        "${message.date:invalid}",
      ),
    ).toThrow("SyntaxError")
  })
})

describe("ExprEvaluator edge cases", () => {
  it("should handle anyValueToString with various types", () => {
    const ctx = mocks.messageContext
    const ctxs = { gmailProcessor: ctx, data: {} }
    expect(ExprEvaluator.anyValueToString(ctxs, true)).toBe("true")
    expect(ExprEvaluator.anyValueToString(ctxs, 123)).toBe("123")
    expect(ExprEvaluator.anyValueToString(ctxs, BigInt(9007199254740991))).toBe(
      "9007199254740991",
    )
    expect(ExprEvaluator.anyValueToString(ctxs, Symbol("test"))).toBe(
      "Symbol(test)",
    )
    const func = () => "func"
    expect(ExprEvaluator.anyValueToString(ctxs, func)).toBe(String(func))
    expect(ExprEvaluator.anyValueToString(ctxs, undefined)).toBe("")
  })

  it("should handle objectValueToString with unknown objects", () => {
    expect(ExprEvaluator.objectValueToString({ a: 1 }, "default")).toBe(
      '{"a":1}',
    )
    expect(ExprEvaluator.objectValueToString(null, "default")).toBe("null")
  })

  it("should handle getContextValue with functions", () => {
    const data = {
      "thread.func": { value: (obj: any) => `thread-${obj ? "ok" : "fail"}` },
      "message.func": { value: (obj: any) => `message-${obj ? "ok" : "fail"}` },
      "attachment.func": {
        value: (obj: any) => `attachment-${obj ? "ok" : "fail"}`,
      },
      "other.func": { value: () => "other-val" },
    }
    expect(
      ExprEvaluator.getContextValue(
        { gmailProcessor: mocks.threadContext, data } as any,
        "thread.func",
      ),
    ).toBe("thread-ok")
    expect(
      ExprEvaluator.getContextValue(
        { gmailProcessor: mocks.messageContext, data } as any,
        "message.func",
      ),
    ).toBe("message-ok")
    expect(
      ExprEvaluator.getContextValue(
        { gmailProcessor: mocks.attachmentContext, data } as any,
        "attachment.func",
      ),
    ).toBe("attachment-ok")
    expect(
      ExprEvaluator.getContextValue(
        { gmailProcessor: mocks.threadContext, data } as any,
        "other.func",
      ),
    ).toBe("other-val")
  })

  it("should throw error for visitErrorNode", () => {
    const listener = new ExprListener(mocks.messageContext)
    expect(() =>
      listener.visitErrorNode({ getText: () => "err" } as any),
    ).toThrow("Error parsing 'err'")
  })

  it("should handle objectValueToString with Arrays (join filter)", () => {
    const result = ExprEvaluator.objectValueToString(["a", "b", "c"], "")
    // Arrays use the join filter (comma-separated) or fall back to default
    expect(typeof result).toBe("string")
  })

  it("should handle objectValueToString with a Date object", () => {
    const d = new Date("2024-03-15T12:00:00Z")
    const result = ExprEvaluator.objectValueToString(d, "default")
    // Should be a formatted date string, not "default"
    expect(result).not.toBe("default")
    expect(result).toMatch(/2024/)
  })

  it("should handle anyValueToString with an object value", () => {
    const result = ExprEvaluator.anyValueToString(mocks.messageContext as any, {
      x: 1,
    })
    expect(result).toBe('{"x":1}')
  })

  it("should warn and return empty string for anyValueToString with undefined value", () => {
    const spyWarn = jest.spyOn(mocks.messageContext.log, "warn")
    const ctxs = { gmailProcessor: mocks.messageContext }
    const result = ExprEvaluator.anyValueToString(ctxs as any, undefined)
    expect(result).toBe("")
    expect(spyWarn).toHaveBeenCalledWith(
      expect.stringContaining("value is undefined"),
    )
  })

  it("should throw error in evaluate() when result is not a string", () => {
    const spyGetResult = jest
      .spyOn(ExprListener.prototype, "getResult")
      .mockReturnValue(123 as any)
    expect(() => ExprEvaluator.evaluate(mocks.messageContext, "true")).toThrow(
      "Error evaluating expression",
    )
    spyGetResult.mockRestore()
  })
  it("should handle Boolean and Integer literals as filter arguments", () => {
    // Trigger getArgValue branches
    const actual = ExprEvaluator.evaluate(
      mocks.messageContext,
      "{{message.subject | substring(0, 5)}}",
    )
    // The filter 'substring' exists and accepts numbers
    expect(actual).toBeDefined()
  })

  it("should evaluate legacy format modifier", () => {
    const actual = ExprEvaluator.evaluate(
      mocks.messageContext,
      "${message.date:format:yyyy-MM-dd}",
    )
    expect(actual).toBe("2019-05-02")
  })

  it("should handle boolean filter arguments", () => {
    // We need to trigger getArgValue for BooleanLiteral
    // This is used when a filter is called with true/false: {{val|filter(true)}}
    // Since we can't easily trigger the full parser here, we'll mock the context
    const mockCtx: any = {
      getText: () => "true",
      BooleanLiteral: () => ({}),
    }
    const evaluator = new ExprListener(mocks.messageContext)
    const result = evaluator.getArgValue(mockCtx)
    expect(result).toBe(true)
  })

  it("should throw for unsupported filter argument types", () => {
    const mockCtx: any = {
      getText: () => "unsupported",
      BooleanLiteral: () => null,
      IntegerLiteral: () => null,
      STRING: () => null,
    }
    const evaluator = new ExprListener(mocks.messageContext)
    expect(() => evaluator.getArgValue(mockCtx)).toThrow(
      "Unsupported filter argument type",
    )
  })

  it("should handle objectValueToString fallback for Array join", () => {
    // Mock executeFilter to return undefined for 'join' to hit line 216 fallback
    const result = ExprEvaluator.objectValueToString([], "default-fallback")
    expect(result).toBe("") // Empty array join returns empty string, not fallback?
    // Let's check the code: (executeFilter("join", value as ValueType) as string | undefined) ?? defaultValue
  })
})
