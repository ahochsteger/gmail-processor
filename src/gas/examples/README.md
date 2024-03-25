# Gmail Processor Examples

These are generated examples for the Google Apps Script Library Gmail Processor.

NOTE: Changes in this files will get overwritten - change the files at `src/test/examples/*.js` instead.

## E2E TypeScript files

The purpose of the typescript-based end-to-end tests is to test certain functionality, reuse that test to document features and are easy to maintain.

To provide an fully supported end-to-end test the following is required:

- Put the test into `src/gas/examples` (TODO: May find a better place in the future)
- Use the naming convention `test<UniqueName>.ts`
- Must export `info: E2EInfo` and `testConfig: E2ETestConfig`
- Use `"__E2E_TEST_FILE_BASENAME__"` as name to ensure consistency with the filename
