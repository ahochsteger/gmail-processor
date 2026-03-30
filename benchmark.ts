import { OrderDirection } from "./src/lib/config/CommonConfig"
import { ThreadOrderField } from "./src/lib/config/ThreadConfig"
import { ThreadProcessor } from "./src/lib/processors/ThreadProcessor"

let getCalls = 0

class MockThread {
  constructor(
    private id: string,
    private date: Date,
    private subject: string,
  ) {}
  getId() {
    getCalls++
    return this.id
  }
  getLastMessageDate() {
    getCalls++
    return this.date
  }
  getFirstMessageSubject() {
    getCalls++
    return this.subject
  }
}

const threads = Array.from(
  { length: 1000 },
  (_, i) =>
    new MockThread(`id-${i}`, new Date(2020, 0, i % 30), `Subject ${i % 100}`),
)

const start = Date.now()
ThreadProcessor.ordered(
  threads as any,
  {
    orderBy: ThreadOrderField.LAST_MESSAGE_DATE,
    orderDirection: OrderDirection.ASC,
  },
  ThreadProcessor.orderRules,
)
const end = Date.now()
console.log(`Total getter calls: ${getCalls}, Time taken: ${end - start} ms`)
