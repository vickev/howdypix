# Contributing

By contributing to Flame, you agree to abide by the [code of conduct](/.github/CODE_OF_CONDUCT.md).

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
