import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ExprEvaluator } from "./ExprEvaluator"

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
