# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Change typescript rules to add better `any` prevention ([#132](https://github.com/vickev/howdypix/pull/132))
- Simplify logic around "." directories to have homogenous "" string ([#132](https://github.com/vickev/howdypix/pull/132))

### Added

- End-to-end tests for most of the features ([#132](https://github.com/vickev/howdypix/pull/132))
- Accessing configs are standardized with the other apps ([#132](https://github.com/vickev/howdypix/pull/132))

## [0.1.0] - 2020-04-09

### Fixed

- Support multiple type of files (jpeg and png for now) ([#101](https://github.com/vickev/howdypix/pull/101))
- Consume one message at a time from rabbitMq ([#101](https://github.com/vickev/howdypix/pull/101))

### Added

- CLI to start the worker
- Retry the connection when RabbitMQ is not available ([#94](https://github.com/vickev/howdypix/pull/94))
- Add ability to set up the number of threads to resize photos ([#112](https://github.com/vickev/howdypix/pull/112))

### Changed

- Use `config` instead of `.env` for configuration
- Changed the output to be `dist` when building  ([#81](https://github.com/vickev/howdypix/pull/81))

## [0.0.2] - 2020-03-07

### Added

- Version bump because lerna


