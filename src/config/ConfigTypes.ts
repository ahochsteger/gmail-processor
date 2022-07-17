// /**
//  * Configuration for GMail2GDrive Google Apps Script
//  */
// export type GMail2GDriveConfig = Config
// /**
//  * Represents a config to handle certain GMail objects (threads, messages, attachments)
//  */
// export type HandlerConfig = AttachmentConfig | GlobalConfig | MessageConfig | ThreadConfig
/**
 * Represents a handler type
 */
export type HandlerType = "attachments" | "global" | "messages" | "threads"
