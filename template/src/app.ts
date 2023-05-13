// Import the Restate Typescript SDK
// This imports the key parts of the SDK that you need to interact with.
import * as restate from "@restatedev/restate-sdk";

// Import the generated Protobuf code of the service contract
import {
  ExampleService,
  SampleRequest,
  SampleResponse,
  protoMetadata,
} from "./generated/proto/example";

// An example of a service
export class MyExampleService implements ExampleService {
  // This example service implements a single method: `sampleCall`.
  // The `sampleCall` method takes a `SampleRequest` and returns a `SampleResponse`, as defined in `proto/example.proto`.
  // Other services will be able to call this method. You can also call it over gRPC or plain HTTP via the command line.
  // A Restate service can contain multiple methods. A method can do arbitrarily anything as long as it is deterministic.
  async sampleCall(request: SampleRequest): Promise<SampleResponse> {
    // The Restate context is the starting point of all interaction with the Restate runtime.
    // Have a look at the Typescript SDK docs to know what you can do with the RestateContext: https://github.com/restatedev/documentation
    const ctx = restate.useContext(this);

    // Implement your service logic here...

    // Return the response
    return SampleResponse.create({ response: "Hello " + request.request });
  }
}

// Create the Restate server to serve your methods
// Bind the services that you implemented:
// provide the name of the service as defined in `proto/example.proto`, an instance of the service implementation
// and the generated protoMetadata.
// Listen on the default port 8080 or any other port you specify.
restate
  .createServer()
  .bindService({
    service: "ExampleService",
    instance: new MyExampleService(),
    descriptor: protoMetadata,
  })
  .listen(8080);
