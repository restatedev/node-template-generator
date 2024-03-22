import * as restate from "@restatedev/restate-sdk";

// Template of a Restate handler that simply echos the request.
//
// The Restate context is the entry point of all interaction with Restate, such as
// - RPCs:         `await ctx.rpc<apiType>({ path: "someService" }).doSomething(key, someData)`
// - messaging:    `ctx.send<apiType>({ path: "someService" }).somethingElse(someData)`
// - state:        `await ctx.get<string>("myState")`
// - side-effects: `await ctx.sideEffect(() => { runExternalStuff() })`
// - timers:       `await ctx.sendDelayed<apiType>({ path: "someService" }, 100_000).somethingElse(someData)`
// - etc.
//
// Have a look at the TS docs on the context, or at https://docs.restate.dev/
//
// The routes and handlers in the service
const router = restate.router({
  hello: async (ctx: restate.Context, name: string) => {
    return `Hello ${name}!`;
  }
});

// The name of the service that serves the handlers
// You can use this to call this service from other services
export const service: restate.ServiceApi<typeof router> = { path: "myservice" }

// Create the Restate server to accept requests
restate
  .endpoint()
  .bindRouter(service.path, router)
  .listen(9080);

// --------------
//  Testing this
// --------------
// Have a look at the quickstart guide at https://docs.restate.dev/get_started/quickstart/
//
// To launch Restate and register this service (if you don't have Restate running already)
//    docker run --name restate_dev --rm -p 8080:8080 -p 9070:9070 -p 9071:9071 --add-host=host.docker.internal:host-gateway docker.io/restatedev/restate:latest
//    curl localhost:9070/deployments  -H 'content-type: application/json' -d '{"uri": "http://host.docker.internal:9080"}'
//
// Invoke this by calling Restate to invoke this handler durably:
//    curl localhost:8080/myservice/hello -H 'content-type: application/json' -d '{ "request": "Friend" }'
