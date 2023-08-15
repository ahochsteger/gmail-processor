/** A flag to match messages with certain properties. */
export enum MessageFlag {
  /** Matches read messages. */
  READ = "read",
  /** Matches starred messages. */
  STARRED = "starred",
  /** Matches unread messages. */
  UNREAD = "unread",
  /** Matches unstarred messages. */
  UNSTARRED = "unstarred",
}
