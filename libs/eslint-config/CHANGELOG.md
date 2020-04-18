# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Introduced `no-unsafe-member-access`, `no-unsafe-return`, `no-unsafe-call`, and `no-unsafe-assignment`
- Added `eslint-plugin-jest` to check the `jest` test files

### Changed

- `ban-ts-ignore` turned to `off` in favour of the other rules
- The `*.spec.ts` have special rules to disable some checks

## [0.1.0] - 2020-04-09

### Fixed

- Change the rule import/extensions to support imorting files without extensions ([#92](https://github.com/vickev/howdypix/pull/92))

## [0.0.2] - 2020-03-07

### Added

- Version bump because lerna


