# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Send the photo to process if the status of the photo in the database is `NOT_PROCESSED`

### Changed

- Change typescript rules to add better `any` prevention ([#132](https://github.com/vickev/howdypix/pull/132))
- Simplify logic around "." directories to have homogenous "" string ([#132](https://github.com/vickev/howdypix/pull/132))

### Added

- Configuration to specify the database location
- End-to-end tests for most of the features ([#132](https://github.com/vickev/howdypix/pull/132))

## [0.1.1] - 2020-04-09

### Fixed

- Include only specific config files in docker

## [0.1.0] - 2020-04-09

### Fixed

- Added more support to send emails (with gmail for example) ([#95](https://github.com/vickev/howdypix/pull/95))
- Fixed issue that displayed all the images when entering a root level ([#101](https://github.com/vickev/howdypix/pull/101))
- Major improvements when scanning the files (send only approved Mime files, and check the RabbitMQ queue before sending new files to process) ([#121](https://github.com/vickev/howdypix/pull/121))

### Added

- CLI to start the server
- Retry the connection when RabbitMQ is not available ([#94](https://github.com/vickev/howdypix/pull/94))
- New column in the photo table: "status"([#121](https://github.com/vickev/howdypix/pull/121))
- Joint tables between photos, albums and sources ([#121](https://github.com/vickev/howdypix/pull/121))

### Changed

- Changed the output to be `dist` when building ([#81](https://github.com/vickev/howdypix/pull/81))
- Thumbnails URLs point to the `webapp` URL instead of the `server` ([#92](https://github.com/vickev/howdypix/pull/92))
- Files served via `/files/*` and not `/static/*` anymore ([#121](https://github.com/vickev/howdypix/pull/121))
- (MAJOR) Changed the VIEW for regular tables to improve the performance ([#121](https://github.com/vickev/howdypix/pull/121))

## [0.0.2] - 2020-03-07

### Added

- Bump the version