import {
  ProcessingError,
  ProcessingResult,
  ProcessingStatus,
  newProcessingResult,
} from "./Context"

it("should create a new processing result", () => {
  const actual = newProcessingResult()
  const expected: ProcessingResult = {
    status: ProcessingStatus.OK,
    executedActions: [],
    processedAttachments: 0,
    processedAttachmentConfigs: 0,
    processedMessages: 0,
    processedMessageConfigs: 0,
    processedThreads: 0,
    processedThreadConfigs: 0,
  }
  expect(actual).toMatchObject(expected)
})

it("should provide a processing error", () => {
  const result = newProcessingResult()
  expect(() => {
    result.status = ProcessingStatus.ERROR
    result.error = new Error("Some action error")
    throw new ProcessingError("Some processing error", result)
  }).toThrowError(ProcessingError)
})
