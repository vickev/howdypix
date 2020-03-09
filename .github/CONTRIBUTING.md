# Contributing

By contributing to HowdyPix, you agree to abide by the [code of conduct](/.github/CODE_OF_CONDUCT.md).

## Development

To get started, clone the repo:

```sh
git clone git@github.com:vickev/howdypix.git
```

To run the local development, you need to run the following commands:

```shell script
yarn        # Install the dependencies
yarn dev    # Start the local servers
```

### Commands

Each commands below must be run at the root of the project.

#### Handling package dependencies

All commands that affect packages will need to be handled using `yarn lerna add <pkg name> packages/<folder>` command, example:

```sh
yarn lerna add lerna packages/dispatcher
```

#### Run tests

```sh
yarn test
```

Or in interactive watch mode:

```sh
yarn test --watch
```

#### Run linting

```sh
yarn lint
```

#### Run typechecking

```sh
yarn typecheck
```
## Git workflow

1. Create a feature branch from `master` (or from a fork if from an external contribution) describing the change (`fix-button-space` for example)
2. When done, push your branch to origin and open a Pull Request with the change in the subject (`Fix Button space` for example)
3. Fill in the required information from the Pull Request template
4. Update `CHANGELOG` based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) by adding a `[Unreleased]` section for the changed package(s). This will allow us to know which type of version bump will be needed once the change is merged and we initiate a [release](../RELEASE.md). For example:

```md
## [Unreleased]

### Fixed

- Fix space ([#520](https://github.com/vickev/howdypix/pull/520))
```

Here's a list of group sections we support for categorization:

- **Added** for new features.
- **Changed** for changes in existing functionality.
- **Deprecated** for soon-to-be removed features.
- **Removed** for now removed features.
- **Fixed** for bug fixes.
- **Dependencies** for updated dependencies.
- **Documentation** for docs updates.
- **Breaking** for breaking changes.
