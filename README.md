# Restate Template for TypeScript / NodeJS services

Restate is a system for easily building resilient applications using **distributed durable RPC & async/await**.

This project offers a basic template for a Restate-based service in [TypeScript](https://www.typescriptlang.org/).

❓ Want to know more about Restate? Have a look at the [Restate documentation](https://github.com/restatedev/documentation).

## Description
The templated project uses the [Restate TypeScript SDK](https://github.com/restatedev/sdk-typescript)
and sets up dependencies, protobuf compilation, and other useful scripts.

This template also contains a minimal runnable example of a Restate service. First, run the example to get an idea of how things tie together. Then, adapt the example and develop your own services. 

The basic steps of developing a Restate service are shown below. For a comprehensive guide, please refer to the [Restate Docs](https://github.com/restatedev/documentation)
and the [TypeScript SDK Readme](https://github.com/restatedev/sdk-typescript/blob/main/README.md).

## Pre-requisites
> &#x1F4DD; As long as Restate hasn't been launched publicly, you need to have access to the private Restate npm packages and Docker container. Please follow the instructions in the `restate-dist` Readme to set up access: https://github.com/restatedev/restate-dist

- [NodeJS (and npm)](https://nodejs.org) installed.
- [Docker Engine](https://docs.docker.com/engine/install/) to launch the Restate runtime (not needed for the app implementation itself).

## Usage

### Setup
Clone the repository.

```shell
git clone git@github.com:restatedev/node-template.git
cd node-template
```

First, get all dependencies and build tools:
```
npm install
```

Next, if needed, adjust the 'proto' definitions in `proto/example.proto`. Then run:
```
npm run proto
```
This generates the Typescript Protobuf code to help you write services according to your service contract. 

### Implement the service
We already included a small example in `src/app.ts` to get you started.
You can take this as a starting point for implementing your own services.

### Run the service
Once you are done with the implementation, build/run the app with:
```
npm run build
npm run app
```
Your Restate service is now up and running!

### Launching the Restate runtime 

To test your service and send requests to it, we need to run the Restate runtime. 
Have a look at how to start up the runtime in a Docker container in this repository: https://github.com/restatedev/restate-dist or simply run the following commands:

- For MacOS:
```shell
docker run -e RUST_LOG=info,restate=debug ghcr.io/restatedev/restate-dist:latest
```
- For Linux:
```shell
docker run -e RUST_LOG=info,restate=debug --network=host ghcr.io/restatedev/restate-dist:latest
```

Once the runtime is up, let it discover your services by executing:

- For MacOS:
```shell
curl -X POST http://localhost:8081/services/discover -H 'content-type: application/json' -d '{"uri": "http://host.docker.internal:8080"}'
```
- For Linux:
```shell
curl -X POST http://localhost:8081/services/discover -H 'content-type: application/json' -d '{"uri": "http://localhost:8080"}'
```

### Sending requests to your service

We can now invoke the `SampleCall` method by executing:

```shell
curl -X POST http://localhost:9090/org.example.ExampleService/SampleCall -H 'content-type: application/json' -d '{"request": "Pete"}'
```

You can see that we include the JSON encoded request body. 
When you are adding or adapting the service methods, adapt the method and request body accordingly.

You can also use grpcurl to invoke your service method:

```shell
grpcurl -plaintext -vv -proto ./proto/example.proto -d '{"request":"1234"}' localhost:9090 org.example.ExampleService/SampleCall
```

That's it! We managed to run a Restate service and invoke it!

## Using development mode (autoregister on changes)

Use `npm run app-dev` to start the application via `ts-node-dev` and reload automatically when files change. 

For more information on the development mode, have a look at its GitHub repository: https://github.com/restatedev/node-dev-mode.

## Contributing to this template

When contributing changes to this template, please avoid checking in the following files:

  - `package-lock.json`
  - `proto/buf.lock`
  - `src/generated/**`

Those files are created by the install/build process. Some (or all) of those files
would typically be checked in by app developers that build on this template, but
should not be part of the template itself.

We currently avoid adding those files to `.gitignore`, so that we don't exclude them
for developers building on top of this template.

To make development of the template itself easier, you can add a local exclude for those
files by adding the lines below to the file `.git/info/exclude`.
You may need to create the file, if it does not exist, yet.

```
# in the projects created from this template, one would typically check those files in
# but we don't want to check them into the template
package-lock.json
proto/buf.lock
src/generated/proto/dev/restate/ext.ts
src/generated/proto/example.ts
src/generated/proto/google/protobuf/descriptor.ts
```

## Useful links 
- Restate Typescript SDK: https://github.com/restatedev/sdk-typescript
- Restate Docker container: https://github.com/restatedev/restate-dist
- The Restate documentation: https://github.com/restatedev/documentation
- Node dev mode: https://github.com/restatedev/node-dev-mode
