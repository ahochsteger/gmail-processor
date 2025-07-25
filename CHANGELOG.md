# Changelog

## [2.16.0](https://github.com/ahochsteger/gmail-processor/compare/v2.15.0...v2.16.0) (2025-07-25)


### Features

* add string function expressions ([779b7cb](https://github.com/ahochsteger/gmail-processor/commit/779b7cbab4d5f4e5ce70292db2fb175ea5a69046))


### Bug Fixes

* **deps:** update libs-non-major ([#523](https://github.com/ahochsteger/gmail-processor/issues/523)) ([a5df9d8](https://github.com/ahochsteger/gmail-processor/commit/a5df9d8106bc69ca945fbd73e62b5ac61af7fad5))
* **deps:** update libs-non-major ([#527](https://github.com/ahochsteger/gmail-processor/issues/527)) ([2face32](https://github.com/ahochsteger/gmail-processor/commit/2face32aeab83bd138f09dd96d97466050fbc6d1))
* **deps:** update libs-non-major ([#547](https://github.com/ahochsteger/gmail-processor/issues/547)) ([624343c](https://github.com/ahochsteger/gmail-processor/commit/624343c42bf3f166be17022fc81dac6afe0826cc))
* parsing of string literals (escapes, empty strings) ([e928b51](https://github.com/ahochsteger/gmail-processor/commit/e928b51910b089927fbdba740a32fcbe73691ddb))

## [2.15.0](https://github.com/ahochsteger/gmail-processor/compare/v2.14.1...v2.15.0) (2025-05-04)


### Features

* add regex matching of raw message headers ([6f29e61](https://github.com/ahochsteger/gmail-processor/commit/6f29e6100cc5c0a99e187f08b9c2301469ec181c))


### Bug Fixes

* complex implementation of extractHeaders ([e632c80](https://github.com/ahochsteger/gmail-processor/commit/e632c80d92c03abc1e2d25f8694d91823de83969))
* various warnings ([4e5d88a](https://github.com/ahochsteger/gmail-processor/commit/4e5d88a02efbd8b9b5f76a8965ff85caf07c2377))

## [2.14.1](https://github.com/ahochsteger/gmail-processor/compare/v2.14.0...v2.14.1) (2025-03-15)


### Bug Fixes

* **deps:** inline parse-duration to fix security issue ([13b1931](https://github.com/ahochsteger/gmail-processor/commit/13b1931eb25a6089eb243e66a2416622599371d8))
* **deps:** update libs-non-major ([#489](https://github.com/ahochsteger/gmail-processor/issues/489)) ([e069fe5](https://github.com/ahochsteger/gmail-processor/commit/e069fe5837a9917d23dd35b500ee5e216aa9a1bf))
* **deps:** update libs-non-major ([#492](https://github.com/ahochsteger/gmail-processor/issues/492)) ([c99b78c](https://github.com/ahochsteger/gmail-processor/commit/c99b78c39e3b6dbcfa1e43daf33b1ccf507edd20))
* **deps:** update libs-non-major ([#495](https://github.com/ahochsteger/gmail-processor/issues/495)) ([00dbc18](https://github.com/ahochsteger/gmail-processor/commit/00dbc182ce486802d16c4e509b920cafc4cde91d))
* path traversal issue ([a11fa26](https://github.com/ahochsteger/gmail-processor/commit/a11fa266d1dc51eac184cb1a35f7c01263d86646))

## [2.14.0](https://github.com/ahochsteger/gmail-processor/compare/v2.13.3...v2.14.0) (2025-03-02)


### Features

* add action `attachment.storeDecryptedPdf` ([64d00ed](https://github.com/ahochsteger/gmail-processor/commit/64d00edff08ced2f19ab5168d02955c6171dd154))
* add example with async custom action to decrypt PDFs ([3300185](https://github.com/ahochsteger/gmail-processor/commit/33001859d6151b16e90e9324c0490f29b45adcd9))


### Bug Fixes

* **deps:** update libs-non-major ([#485](https://github.com/ahochsteger/gmail-processor/issues/485)) ([42ae39f](https://github.com/ahochsteger/gmail-processor/commit/42ae39f3cbfc1167184a7f9fa2346c582ed7c0d2))
* **deps:** update react monorepo to v19 ([a8d0002](https://github.com/ahochsteger/gmail-processor/commit/a8d00025f7ea2422593697dd836a8dc5d80a5035))
* GAS example code processing ([abec3e6](https://github.com/ahochsteger/gmail-processor/commit/abec3e6d904178a3d8c3dfa90309d9b1b032da88))

## [2.13.3](https://github.com/ahochsteger/gmail-processor/compare/v2.13.2...v2.13.3) (2025-02-07)


### Bug Fixes

* **deps:** update dependency parse-duration to v1.1.2 ([a0ad1fb](https://github.com/ahochsteger/gmail-processor/commit/a0ad1fb1ce571fd0998176bc6e2b12492112d6e7))

## [2.13.2](https://github.com/ahochsteger/gmail-processor/compare/2.13.1...v2.13.2) (2025-02-06)


### Bug Fixes

* **deps:** update libs-non-major ([4685135](https://github.com/ahochsteger/gmail-processor/commit/468513529fc33220013dbfb01d4a151250093b41))
* snyk issue in code linter ([5d98e3c](https://github.com/ahochsteger/gmail-processor/commit/5d98e3cf6c1f7db73e77a1ebdf62be92c253bc4f))
* URL reference error ([6b11cef](https://github.com/ahochsteger/gmail-processor/commit/6b11ceff2d32493a00ed9d7930e94ec90502c80c))

## [2.13.1](https://github.com/ahochsteger/gmail-processor/compare/2.13.0...2.13.1) (2024-12-26)


### Bug Fixes

* **deps:** pin dependencies ([c0834a6](https://github.com/ahochsteger/gmail-processor/commit/c0834a68683301834d1eaa63f06d7ecff80a7774))

# [2.13.0](https://github.com/ahochsteger/gmail-processor/compare/2.12.0...2.13.0) (2024-12-26)


### Bug Fixes

* legacy expression compatibility ([b39ca7b](https://github.com/ahochsteger/gmail-processor/commit/b39ca7b87501387407140ddd33c67db68092a967))


### Features

* major deps updates + add more date-fns functions ([c15a47b](https://github.com/ahochsteger/gmail-processor/commit/c15a47b7a09ec813f870684a12981272ea19b278))
* new expression language ([3ea1982](https://github.com/ahochsteger/gmail-processor/commit/3ea19821e35a4a129d1d2c38ecc0b11b3d08a491))

# [2.12.0](https://github.com/ahochsteger/gmail-processor/compare/2.11.1...2.12.0) (2024-07-13)


### Features

* many deps updates (date-fns v3 + new fns, node v22) ([fdab503](https://github.com/ahochsteger/gmail-processor/commit/fdab503641a6dd76c0b820746e488821b6113324))

## [2.11.1](https://github.com/ahochsteger/gmail-processor/compare/2.11.0...2.11.1) (2024-05-29)


### Bug Fixes

* thread order constant names + log date on threads ([cb6624c](https://github.com/ahochsteger/gmail-processor/commit/cb6624c1f8c8cc620b5ffc7cd27a3c954399cddd))

# [2.11.0](https://github.com/ahochsteger/gmail-processor/compare/2.10.1...2.11.0) (2024-05-25)


### Bug Fixes

* custom action name regex + add test ([0ec5b5c](https://github.com/ahochsteger/gmail-processor/commit/0ec5b5cdc67c8d8d1da5bbb958ab30c124587e5b))
* pug security vulnerability ([ee0031d](https://github.com/ahochsteger/gmail-processor/commit/ee0031db57cc3fc098ed363bc8aea4589801df34))
* wrong regex replacement ([3eb0809](https://github.com/ahochsteger/gmail-processor/commit/3eb08094a75500409310ee703c1145a75d1e9859))


### Features

* add custom actions ([e044e22](https://github.com/ahochsteger/gmail-processor/commit/e044e22be2dd4d0b6ae01240567802f1b9009af6))
* add version info lib, logs and docs ([5470741](https://github.com/ahochsteger/gmail-processor/commit/54707419224ca69adc1b94240830c52931884218))

## [2.10.1](https://github.com/ahochsteger/gmail-processor/compare/2.10.0...2.10.1) (2024-05-16)


### Bug Fixes

* null dereference in redact() ([0c6f80c](https://github.com/ahochsteger/gmail-processor/commit/0c6f80c2585b354563cfc3677298662483eb57a6))

# [2.10.0](https://github.com/ahochsteger/gmail-processor/compare/2.9.0...2.10.0) (2024-05-10)


### Features

* add ordering of threads/messages/attachments ([3dfbdbb](https://github.com/ahochsteger/gmail-processor/commit/3dfbdbbcd989e96da1b2e6c008c4b04f124e43e9))

# [2.9.0](https://github.com/ahochsteger/gmail-processor/compare/2.8.0...2.9.0) (2024-05-04)


### Bug Fixes

* linter errors + docs ([488696e](https://github.com/ahochsteger/gmail-processor/commit/488696e925a51403f63133708ef140a7c73ab3db))


### Features

* add log tracing + major log refactoring ([e44f7d0](https://github.com/ahochsteger/gmail-processor/commit/e44f7d002f36f793d868db994664b61c25136c82))
* advanced log sheet logging + example updates ([31d8c46](https://github.com/ahochsteger/gmail-processor/commit/31d8c46dbc47c8f31a9ca1990ed02a31ab565e35))
* enable context meta as field names + refactoring + docs ([17f9959](https://github.com/ahochsteger/gmail-processor/commit/17f9959fd066b8f6dd85118693ef4cc039b61a84))

# [2.8.0](https://github.com/ahochsteger/gmail-processor/compare/2.7.0...2.8.0) (2024-03-17)


### Bug Fixes

* add missing documents permission + improved logging ([a34bcdb](https://github.com/ahochsteger/gmail-processor/commit/a34bcdba38ee26485dbcb23a0917de724deb2e47))
* broken run method when deployed to GAS ([459a201](https://github.com/ahochsteger/gmail-processor/commit/459a2016efe58d113ac94205c39970e403c36bfa))


### Features

* add action attachment.extractText ([209023b](https://github.com/ahochsteger/gmail-processor/commit/209023bd600b3988085883748294992963298b2c))

# [2.7.0](https://github.com/ahochsteger/gmail-processor/compare/2.6.1...2.7.0) (2024-02-18)


### Bug Fixes

* downgrade date-fns to 2.30.0 ([493254a](https://github.com/ahochsteger/gmail-processor/commit/493254a12288fd6613dc21b1df8a063f96735464))
* wrong escape handling in generated docs ([6dc0777](https://github.com/ahochsteger/gmail-processor/commit/6dc0777627e5e37012ca72299b8b9a7ac568dc78))


### Features

* support date expressions in substitutions ([0ec7d1b](https://github.com/ahochsteger/gmail-processor/commit/0ec7d1b927ff6e3b93c778ad73713b660ebb2138))

## [2.6.1](https://github.com/ahochsteger/gmail-processor/compare/2.6.0...2.6.1) (2024-02-17)


### Bug Fixes

* broken file content in updateExistingFile() ([8704586](https://github.com/ahochsteger/gmail-processor/commit/870458690277273311fdbcfd2834286186bb1f46))
* getBlob is not a function error ([056290d](https://github.com/ahochsteger/gmail-processor/commit/056290db806a0ae2d89cdafeb0213fe6908e8782))

# [2.6.0](https://github.com/ahochsteger/gmail-processor/compare/2.5.0...2.6.0) (2024-02-09)


### Bug Fixes

* wrong backslash escape handling ([fd39b72](https://github.com/ahochsteger/gmail-processor/commit/fd39b72aca7c9563afc0b16fa5adfcc794ea9321))


### Features

* add file conversion using drive v2 ([ce31693](https://github.com/ahochsteger/gmail-processor/commit/ce31693079a7092fcd98950917316dbf936e71c2))

# [2.5.0](https://github.com/ahochsteger/gmail-processor/compare/2.4.2...2.5.0) (2024-02-06)


### Bug Fixes

* bad code smells ([5a98584](https://github.com/ahochsteger/gmail-processor/commit/5a98584d4c43b1207836090c8d5e2232003cde04))
* missing blob names ([8f4f8ff](https://github.com/ahochsteger/gmail-processor/commit/8f4f8ffd602819ea871118b2bf2c0b60e35ce969))
* missing URL polyfill + improved regex handling ([fb90dd9](https://github.com/ahochsteger/gmail-processor/commit/fb90dd9b1b009b4130b4e4e986fc97b4e0ef5aae))
* more bad code smells from SonarCloud ([eba4fc6](https://github.com/ahochsteger/gmail-processor/commit/eba4fc620f3eaf8eba69c6732c5c8592c2a0164d))
* security issues reported by SonarCloud ([f1c291a](https://github.com/ahochsteger/gmail-processor/commit/f1c291a95d81f58ad29d30b25398f802b3b0ce93))
* use https to access gravatar.com ([9e2d164](https://github.com/ahochsteger/gmail-processor/commit/9e2d164ded52d99a8a4b30164729c5a45b18dbdc))
* wrong args for thread.exportAsHtml ([44fd4d3](https://github.com/ahochsteger/gmail-processor/commit/44fd4d3e357c355c14f05e84aca030771ad4feaa))


### Features

* improved html+pdf exports of threads+messages ([b70a7ef](https://github.com/ahochsteger/gmail-processor/commit/b70a7ef78ec655cde7a875068907c32296a08831))

## [2.4.2](https://github.com/ahochsteger/gmail-processor/compare/2.4.1...2.4.2) (2023-12-27)


### Bug Fixes

* **deps:** update dependency type-fest to v4.9.0 ([3f07e75](https://github.com/ahochsteger/gmail-processor/commit/3f07e75bbdc9cfc057f6b64e82103c61d0fff55c))

## [2.4.1](https://github.com/ahochsteger/gmail-processor/compare/2.4.0...2.4.1) (2023-11-29)


### Bug Fixes

* revert "build(deps-dev): bump typescript from 5.2.2 to 5.3.2" ([7eee818](https://github.com/ahochsteger/gmail-processor/commit/7eee818e5b433ba88e0a1186818cb88a73ad42c5))

# [2.4.0](https://github.com/ahochsteger/gmail-processor/compare/2.3.2...2.4.0) (2023-10-13)


### Features

* add regex modifier support ([0ebb56f](https://github.com/ahochsteger/gmail-processor/commit/0ebb56f6ba2d49945d3d58864907b0e2592438ce))

## [2.3.2](https://github.com/ahochsteger/gmail-processor/compare/2.3.1...2.3.2) (2023-10-12)


### Bug Fixes

* wrong arg name in thread.addLabel action ([fdb9452](https://github.com/ahochsteger/gmail-processor/commit/fdb9452539f90e6138492b2f5fdfb47f27a57077)), closes [#150](https://github.com/ahochsteger/gmail-processor/issues/150)

## [2.3.1](https://github.com/ahochsteger/gmail-processor/compare/2.3.0...2.3.1) (2023-10-12)


### Bug Fixes

* error on add label action ([1c95098](https://github.com/ahochsteger/gmail-processor/commit/1c950987ee66506c680a31e358b2018d89b78c26)), closes [#150](https://github.com/ahochsteger/gmail-processor/issues/150)

# [2.3.0](https://github.com/ahochsteger/gmail-processor/compare/2.2.0...2.3.0) (2023-10-12)


### Features

* add action message.storeFromURL ([3f817bf](https://github.com/ahochsteger/gmail-processor/commit/3f817bf5355e09b5a80bddb2229fa58aa0f68729)), closes [#136](https://github.com/ahochsteger/gmail-processor/issues/136)
* add message matcher body + plainBody ([eb45984](https://github.com/ahochsteger/gmail-processor/commit/eb45984d1b71a7f0b2736d3b48a81bf5458ce3b8))

# [2.2.0](https://github.com/ahochsteger/gmail-processor/compare/2.1.3...2.2.0) (2023-10-11)


### Features

* add `offset-format` placeholder modifier ([6e56f69](https://github.com/ahochsteger/gmail-processor/commit/6e56f69e2c7a2988c788f6295377e1ed99d2d83b)), closes [#135](https://github.com/ahochsteger/gmail-processor/issues/135)

## [2.1.3](https://github.com/ahochsteger/gmail-processor/compare/2.1.2...2.1.3) (2023-09-19)


### Bug Fixes

* failure on running time-triggered ([731d635](https://github.com/ahochsteger/gmail-processor/commit/731d635865aae30b4d3a1318271ab53ec44ba16b)), closes [#120](https://github.com/ahochsteger/gmail-processor/issues/120)

## [2.1.2](https://github.com/ahochsteger/gmail-processor/compare/2.1.1...2.1.2) (2023-09-18)


### Bug Fixes

* wrong conversion of location with folder IDs ([0993562](https://github.com/ahochsteger/gmail-processor/commit/0993562639c253ed8721ba4b5718f11f9ccf6c90)), closes [#111](https://github.com/ahochsteger/gmail-processor/issues/111)

## [2.1.1](https://github.com/ahochsteger/gmail-processor/compare/2.1.0...2.1.1) (2023-09-18)


### Bug Fixes

* potential ReDoS vulnerability ([e527384](https://github.com/ahochsteger/gmail-processor/commit/e527384656af9c0b0f7d1cb34365bb138d56a386))
* typos, code smells ([f6c9e33](https://github.com/ahochsteger/gmail-processor/commit/f6c9e33c6fdca1334e0fb658996cb1cccdc74adb))

# [2.1.0](https://github.com/ahochsteger/gmail-processor/compare/2.0.5...2.1.0) (2023-09-13)


### Bug Fixes

* broken convertV1Config on Google Apps Script ([edfe49b](https://github.com/ahochsteger/gmail-processor/commit/edfe49b135682bb380f9da36bb2bbd35ca6db2c2))


### Features

* add custom markProcessedMethod, now required ([0a79cd1](https://github.com/ahochsteger/gmail-processor/commit/0a79cd14466de9b946468a861c3d957104adc14c))

## [2.0.5](https://github.com/ahochsteger/gmail-processor/compare/2.0.4...2.0.5) (2023-09-05)


### Bug Fixes

* action error handling ([d5a825c](https://github.com/ahochsteger/gmail-processor/commit/d5a825ce0f46e3a6419947faff9d385fe7f82a4f)), closes [#104](https://github.com/ahochsteger/gmail-processor/issues/104)

## [2.0.4](https://github.com/ahochsteger/gmail-processor/compare/2.0.3...2.0.4) (2023-09-03)


### Bug Fixes

* logger uses wrong console log levels ([a40407d](https://github.com/ahochsteger/gmail-processor/commit/a40407de54ff91fb41af4002bf74ad3ddcc89ee6))
* TypeError on empty message subjects ([9976e45](https://github.com/ahochsteger/gmail-processor/commit/9976e45c19c93471b9ede504d575ecaac6016ef4)), closes [#105](https://github.com/ahochsteger/gmail-processor/issues/105)

## [2.0.3](https://github.com/ahochsteger/gmail-processor/compare/2.0.2...2.0.3) (2023-08-27)


### Bug Fixes

* failure on locations without leading slash ([0d1adb4](https://github.com/ahochsteger/gmail-processor/commit/0d1adb442c1d3b0541fc754a9bba23ae6b56d783))

## [2.0.2](https://github.com/ahochsteger/gmail-processor/compare/2.0.1...2.0.2) (2023-08-25)


### Bug Fixes

* non-working e2e tests + refactoring ([005a305](https://github.com/ahochsteger/gmail-processor/commit/005a305d1f74da226766f5138c2b11a9236dff95))

## [2.0.1](https://github.com/ahochsteger/gmail-processor/compare/2.0.0...2.0.1) (2023-08-23)


### Bug Fixes

* example generation ([1fd5eab](https://github.com/ahochsteger/gmail-processor/commit/1fd5eabe67f2c524e096b45b45f193c103978bb4))
* match processing + improved logging ([16c2ffb](https://github.com/ahochsteger/gmail-processor/commit/16c2ffb6c0d670bac8e944670035cf73b4b99986))

# [2.0.0](https://github.com/ahochsteger/gmail-processor/compare/1.1.0...2.0.0) (2023-08-22)


### Bug Fixes

* add mailmap to fix wrong historic name/email ([cb43d48](https://github.com/ahochsteger/gmail-processor/commit/cb43d4861a6ea6db74a704f14cf7b3fae1bf5fc4))
* add missing dryRun handling ([60f1e19](https://github.com/ahochsteger/gmail-processor/commit/60f1e196c08abf81aebe8c6559393555b75ee926))
* add missing processor base class ([3870c14](https://github.com/ahochsteger/gmail-processor/commit/3870c1400226ac87888c68f0926cf4d26fda8976))
* ci workflow + release config ([49ae903](https://github.com/ahochsteger/gmail-processor/commit/49ae903807efa979468c43f86f5402fbaa0c279c))
* cleanup files after clasp run ([d70cb44](https://github.com/ahochsteger/gmail-processor/commit/d70cb44787dd9f4446e0b2a5230a8de2d0516f88))
* code smells ([b76bcd9](https://github.com/ahochsteger/gmail-processor/commit/b76bcd9a2466c7472afc72ac17b0f3d30e4ddf94))
* commit missing changes from last refactoring ([f7f8f3c](https://github.com/ahochsteger/gmail-processor/commit/f7f8f3c6a944dd2677610aa434e97c9177e9aac8))
* corrupted attachments (string -> blob) ([d698185](https://github.com/ahochsteger/gmail-processor/commit/d698185795cf02b6c6f0196091e6b38cea83d0dd))
* decorator implementation ([7afc98f](https://github.com/ahochsteger/gmail-processor/commit/7afc98f90fc8915614d8ad4a61637dab13198d02))
* docs build ([8eda0e0](https://github.com/ahochsteger/gmail-processor/commit/8eda0e021f2a8eeeeca5ba05f7f574476717c281))
* eliminate defaults from converted config ([1fd9d7f](https://github.com/ahochsteger/gmail-processor/commit/1fd9d7f545c712a81c2b8bd5a2cfcbe3509dd1ef))
* ensure uniqueness of example function names ([38ddbcd](https://github.com/ahochsteger/gmail-processor/commit/38ddbcd7f48b511504afd2ca8fb83a5bbe699136))
* env context structure ([b94b53a](https://github.com/ahochsteger/gmail-processor/commit/b94b53a1eb057153841e0c1017fab2e837f63055))
* failing multiple substitutions of same placeholder ([d5ca9ef](https://github.com/ahochsteger/gmail-processor/commit/d5ca9eff956f101feac3dad8a6c5d37e8adf648c))
* folder conversion without single quotes ([96a6b47](https://github.com/ahochsteger/gmail-processor/commit/96a6b476c3c67b53ec9154bbafe11919eabb4eb0))
* github pages deployment ([a9f08c8](https://github.com/ahochsteger/gmail-processor/commit/a9f08c847a52e90ff5c70498c086ad4e755c5adc))
* github pages deployment ([315c0ff](https://github.com/ahochsteger/gmail-processor/commit/315c0ff714333028e7139b08bc3a0377424a8746))
* GmailProcessor.runWithConfigJson() ([93446d6](https://github.com/ahochsteger/gmail-processor/commit/93446d61f811058a43791bf937fedc37ff6efb0e))
* init e2e tests ([28d974b](https://github.com/ahochsteger/gmail-processor/commit/28d974b5c420c5f7168d7b90c15e0b56a78c9409))
* init e2e tests ([9e00810](https://github.com/ahochsteger/gmail-processor/commit/9e008106304db56ac55f350fef411078d92c02f2))
* logging for generated examples ([9229a3f](https://github.com/ahochsteger/gmail-processor/commit/9229a3f0e561fe4d77d450b2fdbaa66ae6a835cb))
* old reference to processedLabel ([3f7b2ee](https://github.com/ahochsteger/gmail-processor/commit/3f7b2ee9c626addeba80de6ab276d6b3577ebc5b))
* pages deployment + coverage ([506dbb2](https://github.com/ahochsteger/gmail-processor/commit/506dbb2e73b969bf31b3bf73defd6101a234f571))
* regression error + example scopes ([73e87de](https://github.com/ahochsteger/gmail-processor/commit/73e87dee872bbc19dac62052fab0ab26f6a9ccb1))
* release command in workflow ([203a66c](https://github.com/ahochsteger/gmail-processor/commit/203a66cbb18bf98d12409af16011b1c29c8c73f0))
* releases ci steps ([095e5a3](https://github.com/ahochsteger/gmail-processor/commit/095e5a366c1dd3e76c965870da431b43462175ad))
* remaining references to .clasp.json ([b4f5561](https://github.com/ahochsteger/gmail-processor/commit/b4f5561d4767af1cff218f411760f4f764c90d45))
* remove old action refs + styling ([30b450b](https://github.com/ahochsteger/gmail-processor/commit/30b450bd5fd1efd56bae301102006ca791d94634))
* remove performance.now() ([f18f93f](https://github.com/ahochsteger/gmail-processor/commit/f18f93f9137476cd77aeed46e01d422beb4f8928))
* remove test exit in clasp.sh ([a50f4aa](https://github.com/ahochsteger/gmail-processor/commit/a50f4aa42da35518481fc253e13694103042ffac))
* remove unused rootTitle ([72385cb](https://github.com/ahochsteger/gmail-processor/commit/72385cb4f1f0a073fa26aa257517d9af87e6f630))
* remove workflow permission declaration ([7e726ee](https://github.com/ahochsteger/gmail-processor/commit/7e726ee9c35c05102fb40c0d0a884cff4c99e29d))
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
* add github pages publishing ([5d4ff4d](https://github.com/ahochsteger/gmail-processor/commit/5d4ff4da88a103f925f7fda43528d5e27f79ee3a))
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

# [2.0.0-beta.12](https://github.com/ahochsteger/gmail-processor/compare/2.0.0-beta.11...2.0.0-beta.12) (2023-08-22)


### Bug Fixes

* code smells ([b76bcd9](https://github.com/ahochsteger/gmail-processor/commit/b76bcd9a2466c7472afc72ac17b0f3d30e4ddf94))

# [2.0.0-beta.11](https://github.com/ahochsteger/gmail-processor/compare/2.0.0-beta.10...2.0.0-beta.11) (2023-08-22)


### Bug Fixes

* init e2e tests ([28d974b](https://github.com/ahochsteger/gmail-processor/commit/28d974b5c420c5f7168d7b90c15e0b56a78c9409))

# [2.0.0-beta.10](https://github.com/ahochsteger/gmail-processor/compare/2.0.0-beta.9...2.0.0-beta.10) (2023-08-22)


### Bug Fixes

* init e2e tests ([9e00810](https://github.com/ahochsteger/gmail-processor/commit/9e008106304db56ac55f350fef411078d92c02f2))

# [2.0.0-beta.9](https://github.com/ahochsteger/gmail-processor/compare/2.0.0-beta.8...2.0.0-beta.9) (2023-08-22)


### Bug Fixes

* pages deployment + coverage ([506dbb2](https://github.com/ahochsteger/gmail-processor/commit/506dbb2e73b969bf31b3bf73defd6101a234f571))

# [2.0.0-beta.8](https://github.com/ahochsteger/gmail-processor/compare/2.0.0-beta.7...2.0.0-beta.8) (2023-08-22)


### Bug Fixes

* github pages deployment ([a9f08c8](https://github.com/ahochsteger/gmail-processor/commit/a9f08c847a52e90ff5c70498c086ad4e755c5adc))

# [2.0.0-beta.7](https://github.com/ahochsteger/gmail-processor/compare/2.0.0-beta.6...2.0.0-beta.7) (2023-08-22)


### Bug Fixes

* releases ci steps ([095e5a3](https://github.com/ahochsteger/gmail-processor/commit/095e5a366c1dd3e76c965870da431b43462175ad))

# [2.0.0-beta.6](https://github.com/ahochsteger/gmail-processor/compare/2.0.0-beta.5...2.0.0-beta.6) (2023-08-22)


### Bug Fixes

* github pages deployment ([315c0ff](https://github.com/ahochsteger/gmail-processor/commit/315c0ff714333028e7139b08bc3a0377424a8746))
* remove workflow permission declaration ([7e726ee](https://github.com/ahochsteger/gmail-processor/commit/7e726ee9c35c05102fb40c0d0a884cff4c99e29d))

# [2.0.0-beta.5](https://github.com/ahochsteger/gmail-processor/compare/2.0.0-beta.4...2.0.0-beta.5) (2023-08-22)


### Bug Fixes

* cleanup files after clasp run ([d70cb44](https://github.com/ahochsteger/gmail-processor/commit/d70cb44787dd9f4446e0b2a5230a8de2d0516f88))
* eliminate defaults from converted config ([1fd9d7f](https://github.com/ahochsteger/gmail-processor/commit/1fd9d7f545c712a81c2b8bd5a2cfcbe3509dd1ef))
* folder conversion without single quotes ([96a6b47](https://github.com/ahochsteger/gmail-processor/commit/96a6b476c3c67b53ec9154bbafe11919eabb4eb0))
* regression error + example scopes ([73e87de](https://github.com/ahochsteger/gmail-processor/commit/73e87dee872bbc19dac62052fab0ab26f6a9ccb1))

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
