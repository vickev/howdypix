# Authentication

The application uses passwordless authentication method: the user enters his email, and a unique URL (called Magic Link) is sent by email. When he clicks on this link, two tokens are generated: an authentication `token` and a `refreshToken`.

The `token` is attached to every request to the server. If the token is valid (aka not expired, or not incorrect), then the request is successful.

Otherwise, a new token is requested to the server thanks to the `refreshToken`, and this new token is attached to the upcoming requests.
