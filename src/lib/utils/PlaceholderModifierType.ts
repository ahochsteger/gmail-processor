/**
 * The modifiers for placeholder expressions.
 */
export enum PlaceholderModifierType {
  /**
   * The `date` placeholder modifier converts the value of the given placeholder to a `Date` and allows date/time calculations on it.
   *
   * Syntax: `${<placeholder>:date:[[<date-expression>][:<format>]]}`
   * * `<date-expression> = [<date-fns-function>][<+/-><parse-duration>]`: If no expression is given, the date of the placeholder is used unmodified.
   * * `<date-fns-function>`: a supported [`date-fns` function](https://date-fns.org/docs/format) as defined by the constant [`DATE_FNS_FUNCTIONS` in DateUtils.ts](https://github.com/ahochsteger/gmail-processor/blob/main/src/lib/utils/DateUtils.ts)
   * * `<parse-duration>`: a relative duration in the form of a [parse-duration format string](https://github.com/jkroso/parse-duration#api)
   * * `<format>`: Format the resulting date/time using a [date-fns format string](https://date-fns.org/docs/format). If no format is given the setting `defaultTimestampFormat` is used.
   *
   * Examples:
   * * `${message.date:date:lastDayOfMonth-1d:yyyy-MM-DD}`: evaluates to the 2nd last day of the month in which the message has been sent.
   * * `${message.body.match.invoiceDate:date:startOfMonth+4d+1month:yyyy-MM-DD}`: evaluates to the 5th day of the month following the invoice date (extracted using a regex from the message body)
   */
  DATE = "date",
  /**
   * Use `${<placeholder>:format:<format>}` to format the date/time using a [date-fns format string](https://date-fns.org/docs/format).
   * @deprecated Use `${<placeholder>:date::<format>}` instead. Note the double colon if no date modification expression is required.
   */
  FORMAT = "format",
  /**
   * Use `${<placeholder>:join[:<separator>]}` to join the values of an array into a string (default: `,`).
   */
  JOIN = "join",
  /** No modifier */
  NONE = "",
  /**
   * Use `${<placeholder>:offset-format:<offset>[:<format>]}` to calculate the date/time offset using a [parse-duration format string](https://github.com/jkroso/parse-duration#parsestr-formatms) and then format the resulting date/time using a [date-fns format strings](https://date-fns.org/docs/format).
   * @deprecated Use `${<placeholder>:date:<offset>[:<format>]}` instead.
   */
  OFFSET_FORMAT = "offset-format",
  /**
   * Unsupported placeholder modifier type given.
   */
  UNSUPPORTED = "unsupported",
}
