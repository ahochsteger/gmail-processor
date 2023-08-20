# Changelog

# [2.0.0-beta.4](https://github.com/ahochsteger/gmail-processor/compare/2.0.0-beta.3...2.0.0-beta.4) (2023-08-20)


### Bug Fixes

* ci workflow + release config ([49ae903](https://github.com/ahochsteger/gmail-processor/commit/49ae903807efa979468c43f86f5402fbaa0c279c))
* release command in workflow ([203a66c](https://github.com/ahochsteger/gmail-processor/commit/203a66cbb18bf98d12409af16011b1c29c8c73f0))

Changelog

# [2.0.0-beta.3](https://github.com/ahochsteger/gmail-processor/compare/2.0.0-beta.2...2.0.0-beta.3) (2023-08-20)


### Bug Fixes

* docs build ([8eda0e0](https://github.com/ahochsteger/gmail-processor/commit/8eda0e021f2a8eeeeca5ba05f7f574476717c281))


### Features

* add github pages publishing ([5d4ff4d](https://github.com/ahochsteger/gmail-processor/commit/5d4ff4da88a103f925f7fda43528d5e27f79ee3a))

# Changelog

## [2.0.0-beta.2](https://github.com/ahochsteger/gmail-processor/compare/2.0.0-beta.1...2.0.0-beta.2) (2023-08-19)

### Bug Fixes

* remove test exit in clasp.sh ([a50f4aa](https://github.com/ahochsteger/gmail-processor/commit/a50f4aa42da35518481fc253e13694103042ffac))

## [2.0.0-beta.1](https://github.com/ahochsteger/gmail-processor/compare/1.1.0...2.0.0-beta.1) (2023-08-16)

### Bug Fixes

* add mailmap to fix wrong historic name/email ([cb43d48](https://github.com/ahochsteger/gmail-processor/commit/cb43d4861a6ea6db74a704f14cf7b3fae1bf5fc4))
* add missing dryRun handling ([60f1e19](https://github.com/ahochsteger/gmail-processor/commit/60f1e196c08abf81aebe8c6559393555b75ee926))
* add missing processor base class ([3870c14](https://github.com/ahochsteger/gmail-processor/commit/3870c1400226ac87888c68f0926cf4d26fda8976))
* commit missing changes from last refactoring ([f7f8f3c](https://github.com/ahochsteger/gmail-processor/commit/f7f8f3c6a944dd2677610aa434e97c9177e9aac8))
* corrupted attachments (string -> blob) ([d698185](https://github.com/ahochsteger/gmail-processor/commit/d698185795cf02b6c6f0196091e6b38cea83d0dd))
* decorator implementation ([7afc98f](https://github.com/ahochsteger/gmail-processor/commit/7afc98f90fc8915614d8ad4a61637dab13198d02))
* ensure uniqueness of example function names ([38ddbcd](https://github.com/ahochsteger/gmail-processor/commit/38ddbcd7f48b511504afd2ca8fb83a5bbe699136))
* env context structure ([b94b53a](https://github.com/ahochsteger/gmail-processor/commit/b94b53a1eb057153841e0c1017fab2e837f63055))
* failing multiple substitutions of same placeholder ([d5ca9ef](https://github.com/ahochsteger/gmail-processor/commit/d5ca9eff956f101feac3dad8a6c5d37e8adf648c))
* GmailProcessor.runWithConfigJson() ([93446d6](https://github.com/ahochsteger/gmail-processor/commit/93446d61f811058a43791bf937fedc37ff6efb0e))
* logging for generated examples ([9229a3f](https://github.com/ahochsteger/gmail-processor/commit/9229a3f0e561fe4d77d450b2fdbaa66ae6a835cb))
* old reference to processedLabel ([3f7b2ee](https://github.com/ahochsteger/gmail-processor/commit/3f7b2ee9c626addeba80de6ab276d6b3577ebc5b))
* remaining references to .clasp.json ([b4f5561](https://github.com/ahochsteger/gmail-processor/commit/b4f5561d4767af1cff218f411760f4f764c90d45))
* remove old action refs + styling ([30b450b](https://github.com/ahochsteger/gmail-processor/commit/30b450bd5fd1efd56bae301102006ca791d94634))
* remove performance.now() ([f18f93f](https://github.com/ahochsteger/gmail-processor/commit/f18f93f9137476cd77aeed46e01d422beb4f8928))
* remove unused rootTitle ([72385cb](https://github.com/ahochsteger/gmail-processor/commit/72385cb4f1f0a073fa26aa257517d9af87e6f630))
* revert name of attachment.contentType(Regex) ([95b5297](https://github.com/ahochsteger/gmail-processor/commit/95b5297f5c4df57c5efa28f0d7322b54c5e0d845))
* static action method handling ([999091e](https://github.com/ahochsteger/gmail-processor/commit/999091e2b35d36430efd74b1df38ef1d5399a60b))
* store email PDF in same folder as attachments ([74a439d](https://github.com/ahochsteger/gmail-processor/commit/74a439ddf81a4574c72433f1ae48d81af2376fb1)), closes [#36](https://github.com/ahochsteger/gmail-processor/issues/36)
* syntax error ([08af1ef](https://github.com/ahochsteger/gmail-processor/commit/08af1efd8dac48db83c8a7d9a129cb48e41afc2f))
* test errors due to buildMatchConfig changes ([df97b68](https://github.com/ahochsteger/gmail-processor/commit/df97b68d336d4578a58b82094e62ba278f233e71))
* timezone in some ([e9bc0d0](https://github.com/ahochsteger/gmail-processor/commit/e9bc0d0ac72c8e29a8827ac97c8c45b28cec9590))
* trailing hash in schema reference ([a2749f8](https://github.com/ahochsteger/gmail-processor/commit/a2749f8e9db2070c3aa386654c4bf4dcf8e7d97e))
* typo `messgage.matched` -> `message.matched` ([e97d909](https://github.com/ahochsteger/gmail-processor/commit/e97d909959c6d8476f50f080575c964a35f1a2ab))
* use logger passed ([4d00ccf](https://github.com/ahochsteger/gmail-processor/commit/4d00ccfda9e1fafbd46e1d20a447e5ab1426642b))
* wrong branch in .releaserc ([de7b9ef](https://github.com/ahochsteger/gmail-processor/commit/de7b9ef39b46868b157c16e18cba6a906fd8ae61))
* wrong start index of gmail app search ([a1b3f34](https://github.com/ahochsteger/gmail-processor/commit/a1b3f34cbc3e2900d91509bf55a1f00a9d9c3aaa))

### Code Refactoring

* rename gmail2gdrive -> gmail-processor ([525e3db](https://github.com/ahochsteger/gmail-processor/commit/525e3db6cdaf065a4c93dc531e8d278cba54171e))

### Features

* add action handling to processors ([a121889](https://github.com/ahochsteger/gmail-processor/commit/a121889cc55382c52c9fa3bbdc20d001dd0f77c5))
* add compatibility for %filename pattern ([e3bb858](https://github.com/ahochsteger/gmail-processor/commit/e3bb858f8b6a581143e9da25ef50dfd0158560cd)), closes [#50](https://github.com/ahochsteger/gmail-processor/issues/50)
* add conflict strategies backup/update, tests ([d370a8e](https://github.com/ahochsteger/gmail-processor/commit/d370a8e17c5120efa67e86ef0710dad1c98755ae))
* add date filter at rule level ([#60](https://github.com/ahochsteger/gmail-processor/issues/60)) ([ecdb2ea](https://github.com/ahochsteger/gmail-processor/commit/ecdb2ea6e9cf8445ad889fead3b507f6fc71c173))
* add decorator-driven action registry ([584ed75](https://github.com/ahochsteger/gmail-processor/commit/584ed755aa65dde6b214bb5550cf9c823dc4d233))
* add dryrun mode ([c70c44b](https://github.com/ahochsteger/gmail-processor/commit/c70c44ba99eb3fe99f29dfc32c775c8efabf5708))
* add global actions ([96c0707](https://github.com/ahochsteger/gmail-processor/commit/96c0707e3751abe39763d7d66ab916f05a049492))
* add handler name config ([30920ab](https://github.com/ahochsteger/gmail-processor/commit/30920ab8053a856116435da731a91456b5cc17ee))
* add message date matching ([34dba8c](https://github.com/ahochsteger/gmail-processor/commit/34dba8c1663c9cacdbe635fcc87b026bd51f453b))
* add meta infos + docs generation ([f080d44](https://github.com/ahochsteger/gmail-processor/commit/f080d44cd049783380eb006ea98852d733ae6165))
* add option for using a rule counter with filenameTo ([#58](https://github.com/ahochsteger/gmail-processor/issues/58)) ([333212e](https://github.com/ahochsteger/gmail-processor/commit/333212e98e02bd0a0da7f499065f9e27cd60e428))
* add possibility to store each individual email as PDF ([#73](https://github.com/ahochsteger/gmail-processor/issues/73)) ([88f3c34](https://github.com/ahochsteger/gmail-processor/commit/88f3c34a3ce74fbb9d75a5367396a4aa0dd96bd2))
* add processing context substitution ([39c0e5b](https://github.com/ahochsteger/gmail-processor/commit/39c0e5b584c2766eeaf611f6c5bea7964b992873))
* add processing stages to actions (pre/post) ([650654d](https://github.com/ahochsteger/gmail-processor/commit/650654dde47d3f83914a7a222e79899b2b952cb1))
* add regex matching to thread config ([8bf43df](https://github.com/ahochsteger/gmail-processor/commit/8bf43df7722aa34ef7fce983166bad2117011fc4))
* add schema validation, refactor generation ([7937fb3](https://github.com/ahochsteger/gmail-processor/commit/7937fb3031341d93d35781977d919d717f983b11))
* add sender domain to substitution map ([3e657ec](https://github.com/ahochsteger/gmail-processor/commit/3e657ecb4c0abe31b4275cfb1db3f4df21b48adb))
* add SpreadsheetAdapter for logSheet handling ([bf518c1](https://github.com/ahochsteger/gmail-processor/commit/bf518c115b32b4b22f77ae43fdf3bdaac864ce74)), closes [#37](https://github.com/ahochsteger/gmail-processor/issues/37)
* add substitution to match config strings ([b5ea2be](https://github.com/ahochsteger/gmail-processor/commit/b5ea2bea8af6611b4ffcfea8c91af3d3fa0271e5))
* add support for Shared Drives ([#72](https://github.com/ahochsteger/gmail-processor/issues/72)) ([e2adc68](https://github.com/ahochsteger/gmail-processor/commit/e2adc6818bdb3643d0f87a810ea91dca644d40c5))
* add thread matching ([740fab3](https://github.com/ahochsteger/gmail-processor/commit/740fab320df4106806f1527fa50af7628b441e7a))
* allow subject with '%s' in folder name ([#48](https://github.com/ahochsteger/gmail-processor/issues/48)) ([957621b](https://github.com/ahochsteger/gmail-processor/commit/957621b29c88ff749e04fead6acf4e799122e4ba))
* Initial draft of re-implementation for v2 ([91c293b](https://github.com/ahochsteger/gmail-processor/commit/91c293b4d448526c35f55a56e639ac4ca7a37b9f))
* more global configs + main processing stage ([791d1cb](https://github.com/ahochsteger/gmail-processor/commit/791d1cbafde4d5eaecf108df3ad60b5e7fa2277e))
* store single message as PDF to GMail ([c9abd9c](https://github.com/ahochsteger/gmail-processor/commit/c9abd9c234ef55a79c257e40d3e7672a7217558f))
* streamline run methods ([9dd733c](https://github.com/ahochsteger/gmail-processor/commit/9dd733cac2e6b7b44761598db19c3eb01fee99b2))
* substitute user info + variables ([1d67c13](https://github.com/ahochsteger/gmail-processor/commit/1d67c13fec67cf4e1eb2a94ecb18a98bb08f4f9e))

### BREAKING CHANGES

* marker to trigger major version increment

## 1.1.0 (2018-05-27)

* Replaced deprecated DocsList with DriveApp ([58a7a32](https://github.com/ahochsteger/gmail-processor/commit/58a7a32))
* #11 set global filter to default value ('has:attachment -in:trash -in:drafts -in:spam') if it is und ([ff0e18c](https://github.com/ahochsteger/gmail-processor/commit/ff0e18c)), closes [#11](https://github.com/ahochsteger/gmail-processor/issues/11)
* add date format to folders ([9a75634](https://github.com/ahochsteger/gmail-processor/commit/9a75634))
* add date format to folders ([de534b5](https://github.com/ahochsteger/gmail-processor/commit/de534b5))
* Added link to contributors ([345b514](https://github.com/ahochsteger/gmail-processor/commit/345b514))
* Added support for storing all messages of a thread to a PDF document into GDrive ([3837306](https://github.com/ahochsteger/gmail-processor/commit/3837306))
* fix #3 issues - getFolderByPath returns null, throwing exception expected what breaks script executi ([486f8d1](https://github.com/ahochsteger/gmail-processor/commit/486f8d1)), closes [#3](https://github.com/ahochsteger/gmail-processor/issues/3)
* Fixed #11 by adding a globalFilter config using 'has:attachment -in:trash -in:drafts -in:spam' as de ([8ad0a3d](https://github.com/ahochsteger/gmail-processor/commit/8ad0a3d)), closes [#11](https://github.com/ahochsteger/gmail-processor/issues/11)
* Included contribution from Pyrosfr (Use filename filtering #17) and updated configuration and docume ([190dcb8](https://github.com/ahochsteger/gmail-processor/commit/190dcb8)), closes [#17](https://github.com/ahochsteger/gmail-processor/issues/17)
* Moved filter has:attachment from the global filter to only those rules that deal with attachments ([3339965](https://github.com/ahochsteger/gmail-processor/commit/3339965))
* Refactor message processing into its own function ([35e46f8](https://github.com/ahochsteger/gmail-processor/commit/35e46f8))
* Update Code.gs ([02bc5c2](https://github.com/ahochsteger/gmail-processor/commit/02bc5c2))
* Update Code.gs ([152c297](https://github.com/ahochsteger/gmail-processor/commit/152c297))
* Update config.gs ([6707622](https://github.com/ahochsteger/gmail-processor/commit/6707622))
* updates config.gs ([64ea4b8](https://github.com/ahochsteger/gmail-processor/commit/64ea4b8))

## 1.0.0 (2014-03-09)

* Added global filter "has:attachment" ([1178eeb](https://github.com/ahochsteger/gmail-processor/commit/1178eeb))
* Added LICENSE file (Apache 2.0) ([e62ee7c](https://github.com/ahochsteger/gmail-processor/commit/e62ee7c))
* Adjust description ([b53923e](https://github.com/ahochsteger/gmail-processor/commit/b53923e))
* Extended functionality (automatically create labels and folders, enhanced rename) and split configur ([67f3f61](https://github.com/ahochsteger/gmail-processor/commit/67f3f61))
* Fixed README.md ([a05b16c](https://github.com/ahochsteger/gmail-processor/commit/a05b16c))
* Fixed typo in README.md ([610d965](https://github.com/ahochsteger/gmail-processor/commit/610d965))
* Initial commit ([a171778](https://github.com/ahochsteger/gmail-processor/commit/a171778))
* Initial commit ([a1ff56f](https://github.com/ahochsteger/gmail-processor/commit/a1ff56f))
