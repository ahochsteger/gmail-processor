# Notes

## Pending Breaking Changes

- Remove all deprecated configuration properties
  - [src/lib/config/SettingsConfig.ts](src/lib/config/SettingsConfig.ts)
    - Completely remove timezone handling
      - Timezone should be set in project settings or `appscript.json` of Google Apps Script instead. Will be removed in the future.
      - Fixes problem with `date-fns-tz` in combination with `date-fns` >= 3.0
      - Simplifies a lot
      - Remove timezone from all interfaces
