# @howdypix/app-server

This process is responsible to:

- Watch the file changes
- Send to the workers what files to process
- Maintain the database of photos
- Expose a GraphQL endpoint to fetch the photos

# Authentication

The authentication is made with a JWT token attached to every request to the server. If the token is not valid (expired, or invalid), then the client is able to request another token thanks to its refreshToken.

To authenticate a GraphQL query, you just need add then `authenticate` parameter to the Query, as such:

```typescript
queryField("myQuery", {
  // If the user is null, the request is not authenticated.
  authorize: (root, args, ctx) => !!ctx.user

  // ...
});
```
