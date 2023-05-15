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
    // - messagig:     `await ctx.inBackground(() => { (new AnotherServiceClientImpl(ctx)).myMethod(...) } )`
    // - state:        `await ctx.get<string>("myState")`
    // - side-effects: `ctx.sideEffect(() => { runExternalStuff() })`
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
  .createServer()
  .bindService({
    service: "ExampleService", // public name of the service, must match the name in the .proto definition
    instance: new MyExampleService(), // the instance of the implementation
    descriptor: protoMetadata, // the metadata (types, interfaces, ...) captured by the gRPC/protobuf compiler
  })
  .listen(8080);
