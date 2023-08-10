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
const sayHello = async (ctx: restate.RpcContext, name: string) => {
  return `Hello ${name}!`;
};

// Create the Restate server to accept requests
restate
  .createServer()
  .bindRouter(
    "myservice", // the name of the service that serves the handlers
    restate.router({ hello: sayHello }) // the routes and handlers in the service
  )
  .listen(8080);

// --------------
//  Testing this
// --------------
//
// Invoke this by calling Restate to invoke this handler durably:
//
//    curl -X POST -H 'content-type: application/json' http://localhost:9090/myservice/hello -d '{ "request": "Friend" }'
//
// To launch Restate and register this service (if you don't have Restate running already)
//
//  - On macOS:
//    docker run --name restate_dev --rm -p 8081:8081 -p 9091:9091 -p 9090:9090 ghcr.io/restatedev/restate-dist:latest
//    curl -X POST http://localhost:8081/endpoints -H 'content-type: application/json' -d '{"uri": "http://host.docker.internal:8080"}'
//
//  - On Linux:
//    docker run --name restate_dev --rm --network=host ghcr.io/restatedev/restate-dist:latest
//    curl -X POST http://localhost:8081/endpoints -H 'content-type: application/json' -d '{"uri": "http://localhost:8080"}'
