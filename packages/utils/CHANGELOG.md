# @iceywu/utils

## 0.0.54

### Patch Changes

- 1fd1d87: Restore the root @iceywu/utils entry to re-export utility modules such as lodash-lite, is, and tools so existing imports like deepClone, isEmpty, randomString, and sortObj remain compatible.

## 0.0.53

### Patch Changes

- a6e5e72: Upgrade direct dependencies in @iceywu/utils to their latest compatible versions and refresh the lockfile.

## 0.0.52

### Patch Changes

- Fix CommonJS type export conditions so the published package exposes the generated `.d.cts` types correctly for `require` consumers.
