# HowdyPix

Display your photos in a gallery from your personal server. No cloud. Keep your privacy.

## Organization

- `apps/` contains the node applications.
- `libs/` contains the shared code that will be used by the apps / other libs.
- `services/` contains the extra services that are required to run the apps. They are not developed by HowdyPix.

## Development

1. Make sure to have `docker`, `docker-compose`, `node` and `yarn` installed on your machine.

1. Install the dependencies.

   ```
   yarn
   ```

1. Start the dev process.

   ```
   yarn dev
   ```

   This command will watch on any file change in the `apps` and `libs` directory, and restart the node processes.

   You can then go to: http://localhost:3000

The previous command is useful to start everything, but it's more efficient to start processes separately to save time. For example, we rarely need to restart the RabbitMQ docker container. Here are the available commands:

```
yarn dev:libs      # Starts and watches the libs directory
yarn dev:services  # Starts and watches the services directory
yarn dev:apps      # Starts and watches the apps directory
```

You generally run the `dev:libs` and `dev:services` once, and restart many times `dev:apps`.

### Tools for developers

Some tools are available right from the box when developing on this project, and it's important that you know about them since it can dramatically increase the development velocity.

| Tool               | Description                                                                                                            | Default URL                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| GraphQL Playground | Allows to query the schema.                                                                                            | http://localhost:3004/graphql            |
| MailHog            | MailHog is a service to check the emails sent by the application.                                                      | http://localhost:1080                    |
| Email Templates    | To try the emails that will be sent. To change the parameters of the template function, pass them as query parameters. | http://localhost:3004/email              |
| RabbitMQ           | RabbitMQ is the message-bus library.                                                                                   | http://localhost:15672 `guest` / `guest` |

## Code quality

1. Tests are mandatory for the most part of the application.
1. Typescript has the `strict` option to enable better typing.
