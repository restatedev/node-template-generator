import * as restate from "@restatedev/restate-sdk";

import { protoMetadata } from "./generated/proto/example";
import { MyExampleService } from "./example_service";

// Create the Restate server to accept requests to the service(s)
restate
  .createServer()
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
// Invoke this by calling Restate to invoke this handler durably:
//
//    curl -X POST -H 'content-type: application/json' http://localhost:8080/org.example.ExampleService/SampleCall -d '{ "request": "Friend" }'
//
// To launch Restate and register this service (if you don't have Restate running already)
//
//  - On macOS:
//    docker run --name restate_dev --rm -p 8080:8080 -p 9070:9070 -p 9071:9071 docker.io/restatedev/restate:latest
//    curl -X POST http://localhost:9070/endpoints -H 'content-type: application/json' -d '{"uri": "http://host.docker.internal:9080"}'
//
//  - On Linux:
//    docker run --name restate_dev --rm --network=host docker.io/restatedev/restate:latest
//    curl -X POST http://localhost:9070/endpoints -H 'content-type: application/json' -d '{"uri": "http://localhost:9080"}'
