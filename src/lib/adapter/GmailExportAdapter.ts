import addressparser, { EmailAddress } from "addressparser"
import "core-js/web/url"
import crypto from "crypto"
import { format } from "date-fns-tz"
import { EnvContext } from "../Context"
import { SettingsConfig } from "../config/SettingsConfig"
import { BaseAdapter } from "./BaseAdapter"

export type ExportOptionsType = {
  /** Include the message header (default: `true`) */
  includeHeader?: boolean
  /** Include attachments (default: `true`) */
  includeAttachments?: boolean
  /** Embed attachments (default: `true`) */
  embedAttachments?: boolean
  /** Embed remote images (default: `true`) */
  embedRemoteImages?: boolean
  /** Embed inline images (default: `true`) */
  embedInlineImages?: boolean
  /** Embed an avatar (from Gravatar) of the sender (default: `true`) */
  embedAvatar?: boolean
  /** The width (in px) of the message (default: `700`) */
  width?: number
}

export class GmailExportAdapter extends BaseAdapter {
  constructor(
    public ctx: EnvContext,
    public settings: SettingsConfig,
  ) {
    super(ctx, settings)
  }

  protected addressesToHtml(emails?: EmailAddress[]): string {
    const addresses: EmailAddress[] =
      emails === undefined ? [] : !Array.isArray(emails) ? [emails] : emails
    return addresses
      .map(
        (email) =>
          '<a href="mailto:' + email.address + '">' + email.address + "</a>",
      )
      .join("")
  }

  protected getAvatar(email?: EmailAddress): GoogleAppsScript.Base.Blob | null {
    this.ctx.log.debug(`GMailExportAdapter.getAvatar(): ${email?.address}`)
    const address = email?.address
    if (!address) return null
    const avatarUrl =
      "https://www.gravatar.com/avatar/" +
      crypto.createHash("sha256").update(address).digest("hex") +
      "?s=128&d=404"
    this.ctx.log.debug(
      `GMailExportAdapter.getAvatar(): fetching from ${avatarUrl} ...`,
    )
    const image = this.fetchRemoteFile(avatarUrl)
    this.ctx.log.debug(`GMailExportAdapter.getAvatar(): returning ${image}`)
    return image
  }

  /**
   * Fetch a remote file and return as a Blob object on success
   */
  protected fetchRemoteFile(url: string): GoogleAppsScript.Base.Blob | null {
    try {
      const response = this.ctx.env.urlFetchApp.fetch(url, {
        muteHttpExceptions: true,
      })
      return response.getResponseCode() == 200 ? response.getBlob() : null
    } catch (e) {
      return null
    }
  }

  protected getDataUri(
    image?:
      | string
      | GoogleAppsScript.Gmail.GmailAttachment
      | GoogleAppsScript.Base.Blob,
  ): string | null {
    let imageBlob: GoogleAppsScript.Base.Blob | null = null
    if (typeof image == "string" && URL.canParse(image)) {
      imageBlob = this.fetchRemoteFile(image)
    } else if (typeof image === "object") {
      imageBlob = image as GoogleAppsScript.Base.Blob // Note: GmailAttachment has all methods of Blob
    }
    if (!imageBlob) {
      return null
    }
    if (imageBlob.getContentType()) {
      const type = imageBlob.getContentType()?.toLowerCase()
      const data = Utilities.base64Encode(imageBlob.getBytes())
      if (type?.indexOf("image") == 0) {
        const dataUrl = "data:" + type + ";base64," + data
        return dataUrl
      }
    }
    return null
  }

  protected embedInlineImages(
    email: GoogleAppsScript.Gmail.GmailMessage,
    html: string,
  ): string {
    const images: GoogleAppsScript.Base.Blob[] = email
      .getAttachments({ includeInlineImages: true, includeAttachments: false })
      .map((att) => att.copyBlob())
      .filter((blob) => blob) as GoogleAppsScript.Base.Blob[]
    // process all img tags which reference "attachments"
    return this.processImgAttachments(html, images)
  }

  protected embedHtmlImages(html: string): string {
    // process all img tags
    html = this.processImageTags(html)
    // process all style attributes
    html = this.processStyleAttributes(html)
    // process all style tags
    html = this.processStyleTags(html)
    return html
  }

  /**
   * Download and embed all img tags
   */
  protected processImageTags(html: string): string {
    return html.replace(
      /(?<tag><img[^>]+src=)(?<q>["'])(?<src>(?:(?!\2)[^\\]|\\.)*)\2/gi,
      (_m, tag, q, src) => tag + q + (this.getDataUri(src) || src) + q,
    )
  }

  /**
   * Download and embed all HTML Style Attributes
   */
  protected processStyleAttributes(html: string): string {
    return html.replace(
      /(?<tag>\bstyle\s*=\s*)(?:(?<dq>")(?<dqStyle>[^"]+)"|(?<sq>')(?<sqStyle>[^']+)')/gi,
      (_m, tag, dq, dqStyle, _sq, sqStyle) => {
        const q = dq ? '"' : "'"
        let style = dq ? dqStyle : sqStyle
        style = style.replace(
          /url\((?<q>\\?["']?)(?<url>[^)]*)\1\)/gi,
          (_m: string, q: string, url: string) =>
            "url(" + q + (this.getDataUri(url) || url) + q + ")",
        )
        return tag + q + style + q
      },
    )
  }

  /**
   * Download and embed all HTML Style Tags
   */
  protected processStyleTags(html: string): string {
    return html.replace(
      /(?<tag><style[^>]*>)(?<style>.*?)(?<end><\/style>)/gi,
      (_m, tag, style, end) => {
        style = style.replace(
          /url\((?<q>["']?)(?<url>[^)]*)\1\)/gi,
          (_m: unknown, q: string, url: string) =>
            "url(" + q + (this.getDataUri(url) || url) + q + ")",
        )
        return tag + style + end
      },
    )
  }

  /**
   * Download and embed all HTML Inline Image Attachments
   */
  protected processImgAttachments(
    html: string,
    images: (
      | GoogleAppsScript.Base.Blob
      | GoogleAppsScript.Gmail.GmailAttachment
    )[],
  ): string {
    return html.replace(
      /(?<tag><img[^>]+src=)(?<q>["'])(?<src>\?view=att(?:(?!\2)[^\\]|\\.)*)\2/gi,
      (_m, tag, q, src) =>
        tag + q + (this.getDataUri(images.shift()) || src) + q,
    )
  }

  protected generateMessageHtmlBody(
    message: GoogleAppsScript.Gmail.GmailMessage,
    opts: ExportOptionsType,
  ): string {
    let html = ""
    const ind = "    "
    const subject = message.getSubject()
    const date = message.getDate()
      ? format(message.getDate().getTime(), "yyyy-MM-dd HH:mm:ss", {
          timeZone: this.ctx.env.timezone,
        })
      : ""
    const from = this.addressesToHtml(addressparser(message.getFrom()))
    const to = this.addressesToHtml(addressparser(message.getTo()))
    const cc = this.addressesToHtml(addressparser(message.getCc()))
    const bcc = this.addressesToHtml(addressparser(message.getBcc()))
    let avatar = null
    if (opts.includeHeader) {
      if (
        opts.embedAvatar &&
        (avatar = this.getAvatar(
          addressparser(message.getFrom())[0],
        ) as GoogleAppsScript.Base.Blob)
      ) {
        avatar = `<dd class="avatar"><img src="${this.getDataUri(avatar)}" /></dd>`
      } else {
        avatar = ""
      }
      html += `${ind}<dl class="email-meta">
${ind}  <dt>From:</dt>${avatar}<dd class="strong">${from}</dd>
${ind}  <dt>Subject:</dt><dd>${subject}</dd>
${ind}  <dt>Date:</dt><dd>${date}</dd>
${ind}  <dt>To:</dt><dd>${to}</dd>\n`
    }
    // Appending cc and bcc if they exist
    if (cc) {
      html += `${ind}  <dt>cc:</dt><dd>${cc}</dd>\n`
    }
    if (bcc) {
      html += `${ind}<dt>bcc:</dt><dd>${bcc}</dd>\n`
    }
    html += `${ind}</dl>\n`
    let body = message.getBody()
    if (opts.embedRemoteImages) {
      body = this.embedHtmlImages(body)
    }
    if (opts.embedInlineImages) {
      body = this.embedInlineImages(message, body)
    }
    if (opts.includeAttachments) {
      const attachments = message.getAttachments()
      if (attachments.length > 0) {
        body += `\n${ind}<br />
${ind}<strong>Attachments:</strong>
${ind}<div class="email-attachments">\n`

        for (let a = 0; a < attachments.length; a++) {
          const filename = attachments[a].getName()
          let imageData

          if (
            opts.embedAttachments &&
            (imageData = this.getDataUri(attachments[a].copyBlob()))
          ) {
            body += `${ind}  <img src="${imageData}" alt="&lt;${filename}&gt;" /><br />\n`
          } else {
            body += `${ind}  &lt;${filename}&gt;<br />\n`
          }
        }
        body += `${ind}</div>\n`
      }
    }
    html += body
    return html
  }

  public generateMessagesHtml(
    messages: GoogleAppsScript.Gmail.GmailMessage[],
    opts: ExportOptionsType,
  ): string {
    // NOTE: This is based on code from https://github.com/pixelcog/gmail-to-pdf.
    opts = {
      includeHeader: opts.includeHeader ?? true,
      includeAttachments: opts.includeAttachments ?? true,
      embedAttachments: opts.embedAttachments ?? true,
      embedRemoteImages: opts.embedRemoteImages ?? true,
      embedInlineImages: opts.embedInlineImages ?? true,
      embedAvatar: opts.embedAvatar ?? true,
      width: opts.width ?? 700,
    }

    let html = `<html>
  <head>
    <style type="text/css">
      body{padding:0 10px;min-width:${opts.width}px;-webkit-print-color-adjust: exact;}
      body>dl.email-meta{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:14px;padding:0 0 10px;margin:0 0 5px;border-bottom:1px solid #ddd;page-break-before:always}
      body>dl.email-meta:first-child{page-break-before:auto}
      body>dl.email-meta dt{color:#808080;float:left;width:60px;clear:left;text-align:right;overflow:hidden;text-overf‌low:ellipsis;white-space:nowrap;font-style:normal;font-weight:700;line-height:1.4}
      body>dl.email-meta dd{margin-left:70px;line-height:1.4}
      body>dl.email-meta dd a{color:#808080;font-size:0.85em;text-decoration:none;font-weight:normal}
      body>dl.email-meta dd.avatar{float:right}
      body>dl.email-meta dd.avatar img{max-height:72px;max-width:72px;border-radius:36px}
      body>dl.email-meta dd.strong{font-weight:bold}
      body>div.email-attachments{font-size:0.85em;color:#999}
    </style>
  </head>
  <body>\n`

    for (const message of messages) {
      html += this.generateMessageHtmlBody(message, opts)
    }
    html += "  </body>\n</html>"

    return html
  }
}
