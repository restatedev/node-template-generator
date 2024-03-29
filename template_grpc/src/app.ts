import * as restate from "@restatedev/restate-sdk";

import {
  ExampleService,
  SampleRequest,
  SampleResponse,
  protoMetadata,
} from "./generated/proto/example";

/*
 * The example service here implements the interface generated from the 'example.proto' file.
 */
export class MyExampleService implements ExampleService {
  async sampleCall(request: SampleRequest): Promise<SampleResponse> {
    // The Restate context is the entry point of all interaction with Restate, such as
    // - RPCs:         `await (new AnotherServiceClientImpl(ctx)).myMethod(...)`
    // - messaging:    `await ctx.oneWayCall(() => { (new AnotherServiceClientImpl(ctx)).myMethod(...) } )`
    // - state:        `await ctx.get<string>("myState")`
    // - side-effects: `await ctx.sideEffect(() => { runExternalStuff() })`
    // - etc.
    //
    // Have a look at the TS docs or at https://github.com/restatedev/documentation
    const ctx = restate.useContext(this);

    // Service logic goes here...

    return SampleResponse.create({ response: "Hello " + request.request });
  }
}

// Create the Restate server to accept requests to the service(s)
restate
  .endpoint()
  .bindService({
    service: "ExampleService", // public name of the service, must match the name in the .proto definition
    instance: new MyExampleService(), // the instance of the implementation
    descriptor: protoMetadata, // the metadata (types, interfaces, ...) captured by the gRPC/protobuf compiler
  })
  .listen(9080);

// --------------
//  Testing this
// --------------
//
// Have a look at the quickstart guide at https://docs.restate.dev/get_started/quickstart/
//
// To launch Restate and register this service (if you don't have Restate running already)
//    docker run --name restate_dev --rm -p 8080:8080 -p 9070:9070 -p 9071:9071 --add-host=host.docker.internal:host-gateway docker.io/restatedev/restate:latest
//    curl localhost:9070/deployments  -H 'content-type: application/json' -d '{"uri": "http://host.docker.internal:9080"}'
//
// Invoke this by calling Restate to invoke this handler durably:
//
//    curl -X POST -H 'content-type: application/json' http://localhost:8080/org.example.ExampleService/SampleCall -d '{ "request": "Friend" }'
