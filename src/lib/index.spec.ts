import { PartialDeep } from "type-fest"
import { convertV1Config, run } from "."
import { ConfigMocks } from "../test/mocks/ConfigMocks"
import { MockFactory, Mocks } from "../test/mocks/MockFactory"
import { RunMode } from "./Context"
import { Config, newConfig } from "./config/Config"

let configJson: PartialDeep<Config>
let mocks: Mocks

beforeEach(() => {
  configJson = ConfigMocks.newDefaultConfigJson()
  mocks = MockFactory.newMocks(newConfig(configJson), RunMode.DANGEROUS)
})

describe("run", () => {
  it("test", () => {
    const result = run(configJson, RunMode.DANGEROUS, mocks.envContext)
    expect(result.status).toEqual("ok")
  })
})

describe("v1 config compatibility", () => {
  const expectedConfig = {
    settings: {
      markProcessedLabel: "gmail2gdrive/client-test",
    },
    threads: [
      {
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location:
                        "/Scans${message.date:format:-yyyy-MM-dd}/${attachment.name}",
                    },
                    name: "attachment.store",
                  },
                ],
              },
            ],
          },
        ],
        match: {
          query: "to:my.name+scans@gmail.com",
        },
      },
      {
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location: "/Examples/example1/${attachment.name}",
                    },
                    name: "attachment.store",
                  },
                ],
              },
            ],
          },
        ],
        match: {
          query: "from:example1@example.com",
        },
      },
      {
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location: "/Examples/example2/${attachment.name.match.1}",
                    },
                    name: "attachment.store",
                  },
                ],
                match: {
                  name: ".*.pdf$",
                },
              },
            ],
          },
        ],
        match: {
          query: "from:example2@example.com",
        },
      },
      {
        actions: [
          {
            name: "thread.moveToArchive",
          },
        ],
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location:
                        "/Examples/example3ab/file-${message.date:format:yyyy-MM-dd-}${message.subject}.txt",
                    },
                    name: "attachment.store",
                  },
                ],
              },
            ],
          },
        ],
        match: {
          query: "(from:example3a@example.com OR from:example3b@example.com)",
        },
      },
      {
        actions: [
          {
            args: {
              location: "/PDF Emails/${thread.firstMessageSubject}.pdf",
            },
            name: "thread.storePDF",
          },
        ],
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location: "/PDF Emails/${attachment.name}",
                    },
                    name: "attachment.store",
                  },
                ],
              },
            ],
          },
        ],
        match: {
          query: "label:PDF",
        },
      },
      {
        messages: [
          {
            attachments: [
              {
                actions: [
                  {
                    args: {
                      conflictStrategy: "keep",
                      description:
                        "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
                      location:
                        "/Examples/example4/file-${message.date:format:yyyy-MM-dd-}${message.subject}.txt",
                    },
                    name: "attachment.store",
                  },
                ],
                match: {
                  name: "file\\.txt",
                },
              },
            ],
          },
        ],
        match: {
          query: "from:example4@example.com",
        },
      },
    ],
  }
  it("should convert a v1 config JSON to v2 config", () => {
    const v1config = ConfigMocks.newDefaultV1ConfigJson()
    const actual = convertV1Config(v1config)
    expect(actual).toMatchObject(expectedConfig)
  })
  // it("should get essential v2 config from v1 config", () => {
  //   const v1config = {
  //     // Gmail label for processed threads:
  //     processedLabel: "to-gdrive/processed",

  //     // Sleep time in milli seconds between processed messages:
  //     sleepTime: 100,

  //     // Maximum script runtime in seconds (google scripts will be killed after 5 minutes):
  //     maxRuntime: 280,

  //     // Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year):
  //     newerThan: "",

  //     // Timezone for date/time operations:
  //     timezone: "CEST",

  //     // Processing rules:
  //     rules: [
  //       // Rule parameter documentation:
  //       //  * filter (String, mandatory): a typical gmail search expression (see http://support.google.com/mail/bin/answer.py?hl=en&answer=7190)
  //       //  * folder (String, mandatory): a path to an existing Google Drive folder
  //       //  * archive (boolean, optional): Should the gmail thread be archived after processing? (default: false)
  //       //  * filenameFrom (String, optional): The attachment filename that should be renamed when stored in Google Drive
  //       //  * filenameTo (String, optional): The pattern for the new filename of the attachment. You can use '%s' to insert the email subject and date format patterns like 'yyyy' for year, 'MM' for month and 'dd' for day as pattern in the filename.
  //       //    See https://developers.google.com/apps-script/reference/utilities/utilities#formatDate(Date,String,String) for more information on the possible date format strings.
  //       {
  //         filter: "to:andreas.hochsteger+scans@gmail.com",
  //         folder: "Scans",
  //         filenameFrom: "scan.pdf",
  //         filenameTo: "'%s - 'yyyy-MM-dd'.pdf'",
  //         archive: true,
  //       },
  //       {
  //         filter: "to:andreas.hochsteger+scans-jonas-schule@gmail.com",
  //         folder: "Schule/Jonas/TGM/TGM Scans",
  //         filenameFrom: "scan.pdf",
  //         filenameTo: "'%s - 'yyyy-MM-dd'.pdf'",
  //         archive: true,
  //       },
  //       {
  //         filter: "to:andreas.hochsteger+scans-jonas-ahs@gmail.com",
  //         folder: "Schule/Jonas/AHS Rosasgasse/AHS Rosasgasse Scans",
  //         filenameFrom: "scan.pdf",
  //         filenameTo: "'%s - 'yyyy-MM-dd'.pdf'",
  //         archive: true,
  //       },
  //       {
  //         filter: "to:andreas.hochsteger+scans-johanna-schule@gmail.com",
  //         folder: "Schule/Johanna/LG15/LG15 Scans",
  //         filenameFrom: "scan.pdf",
  //         filenameTo: "'%s - 'yyyy-MM-dd'.pdf'",
  //         archive: true,
  //       },
  //       {
  //         filter: "to:andreas.hochsteger+scans-johanna-vs@gmail.com",
  //         folder: "Schule/Johanna/VS Friedrichsplatz/VS Scans",
  //         filenameFrom: "scan.pdf",
  //         filenameTo: "'%s - 'yyyy-MM-dd'.pdf'",
  //         archive: true,
  //       },
  //       {
  //         filter: "to:andreas.hochsteger+scans-johanna-noten@gmail.com",
  //         folder: "Freizeit/Johanna/Klavier",
  //         filenameFrom: "scan.pdf",
  //         filenameTo: "'%s - 'yyyy-MM-dd'.pdf'",
  //         archive: true,
  //       },
  //       {
  //         filter: "to:andreas.hochsteger+scans-finanzen@gmail.com",
  //         folder: "Finanzen/Finanzen Scans",
  //         filenameFrom: "scan.pdf",
  //         filenameTo: "'%s - 'yyyy-MM-dd'.pdf'",
  //         archive: true,
  //       },
  //       {
  //         filter: "to:andreas.hochsteger+scans-rechnungen@gmail.com",
  //         folder: "Finanzen/Rechnungen/Rechnungen Scans",
  //         filenameFrom: "scan.pdf",
  //         filenameTo: "'%s - 'yyyy-MM-dd'.pdf'",
  //         archive: true,
  //       },
  //       {
  //         filter: "to:andreas.hochsteger+scans-geraete@gmail.com",
  //         folder: "Geräte/Geräte Scans",
  //         filenameFrom: "scan.pdf",
  //         filenameTo: "'%s - 'yyyy-MM-dd'.pdf'",
  //         archive: true,
  //       },
  //       {
  //         filter: "from:monatsrechnung@cardcomplete.com",
  //         folder: "Finanzen/VISA",
  //       },
  //       {
  //         filter: "(from:@upc.at rechnung)",
  //         folder: "Finanzen/UPC",
  //       },
  //       {
  //         filter: "from:e-rechnung@wienenergie.at",
  //         folder: "Finanzen/Wienenergie",
  //       },
  //       {
  //         filter: "label:PDF",
  //         saveThreadPDF: true,
  //         folder: "PDF Emails",
  //       },
  //       {
  //         // old email
  //         filter:
  //           "(from:erste-sparinvestkag@sparinvest.com OR from:ZZFMP40969@sparinvest.com OR from:erste@sparinvest.com OR from:Aboservice@erste-am.com)",
  //         folder:
  //           "Finanzen/Bank/Sparkasse/Finanzierung/AT36 2025 7000 0711 2378",
  //         filenameFrom: "rechenwert.csv",
  //         filenameTo: "'rechenwert-'yyyy-MM-dd'.csv'",
  //         archive: true,
  //       },
  //       {
  //         // new email
  //         filter: "from:erste@sparinvest.com",
  //         folder:
  //           "Finanzen/Bank/Sparkasse/Finanzierung/AT36 2025 7000 0711 2378",
  //         archive: true,
  //       },
  //       {
  //         // new email
  //         filter:
  //           "(from:zustellung@meinbrief.at OR from:no-reply@meinbrief.at) pdf",
  //         folder: "Finanzen/Mein Brief/Zustellungen",
  //         archive: true,
  //       },
  //       {
  //         // Replace all files with the variable 'filenameTo' string using regex match groups from subjectRegex.
  //         filter: "to:andreas.hochsteger+scans-test@gmail.com",
  //         folder: "Scans-Test",
  //         subjectRegex: "Prefix - (.*) - Suffix", // Provides the matching regex groups as $1, $2, ... for substitution in filenameTo
  //         filenameFrom: "testfile.txt",
  //         filenameTo: "'$1 'yyyy-MM-dd",
  //         archive: true,
  //       },
  //     ],
  //   }

  //   const effectiveConfig = getEffectiveConfigV1(v1config)
  //   const actual = getEssentialConfig(effectiveConfig)
  //   expect(actual).toMatchObject(expectedConfig)
  // })
  it("should get essential v2 config from v1 config", () => {
    const exampleMinConfigV1 = {
      processedLabel: "gmail2gdrive/client-test",
      sleepTime: 100,
      maxRuntime: 280,
      newerThan: "2m",
      timezone: "GMT",
      rules: [
        {
          filter: "to:my.name+scans@gmail.com",
          folder: "'Scans'-yyyy-MM-dd",
        },
      ],
    }
    const essentialConfig = convertV1Config(exampleMinConfigV1)
    console.log(JSON.stringify(essentialConfig, null, 2))
  })
})
