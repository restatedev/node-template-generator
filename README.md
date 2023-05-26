# Restate Template for TypeScript / NodeJS services

This project offers a template for a Restate-based service in [TypeScript](https://www.typescriptlang.org/).

Restate is a system for easily building resilient applications using **distributed durable RPC & async/await**.

❓ Learn more about Restate from the [Restate documentation](https://github.com/restatedev/documentation).

## tl;dr

To set up the template service, use this sequence of commands:

> &#x1F4DD; Make sure you have set up your [access to Restate's packages](https://github.com/restatedev/restate-dist)

```shell
npx -y @restatedev/create-app
cd restate-node-template

npm install
npm run proto
npm run build

npm run app
```

## Step by step

The templated project uses the [Restate TypeScript SDK](https://github.com/restatedev/sdk-typescript)
and sets up dependencies, protobuf compilation, and other useful scripts.

This template also contains a minimal runnable example of a Restate service. First, run the example to get an idea of how things tie together. Then, adapt the example and develop your own services.

The basic steps of developing a Restate service are shown below. For a comprehensive guide, please refer to the [Restate Docs](https://github.com/restatedev/documentation)
and the [TypeScript SDK Readme](https://github.com/restatedev/sdk-typescript/blob/main/README.md).

### Pre-requisites

- [NodeJS (and npm)](https://nodejs.org) installed.
- [Docker Engine](https://docs.docker.com/engine/install/) to launch the Restate runtime (not needed for the app implementation itself).

> &#x1F4DD; As long as Restate hasn't been launched publicly, you need to have access to the private Restate npm packages and Docker container. Please follow the instructions in the `restate-dist` Readme to set up access: https://github.com/restatedev/restate-dist

### Create the template and install dependencies

Use `npx` to run the `@restatedev/create-app` template generator. This gives you the raw project, with the Restate SDK dependency, a simple protobuf setup, and
a sample application.

```shell
npx -y @restatedev/create-app
cd restate-node-template
```

Next, install Restate's nodejs dependencies:
```shell
npm install
```

### Implement the Service

Restate service interfaces are defined using [gRPC](https://grpc.io/). The interface definitions are in the `proto` directory, including the sample service definition in `proto/example.proto`.

Adjust the interface definition (or not, if you only want to run the sample service). To generate the TypeScript interfaces for the services, run:
```
npm run proto
```

The actual service logic goes into the implementation of the generated interfaces.
We already included a small example in `src/app.ts` to get you started.

### Run the service
Once you are done with the implementation, build/run the app with:
```
npm run build
npm run app
```
Your Restate service is now up and running!

### Run the service on AWS Lambda
To run the service as an AWS Lambda function, we need to upload it as a zip file on AWS.
Create the zip file with:
```shell
npm run bundle
```
Make sure you create a Restate Lambda handler called `handler` in `src/app.ts`, instead of a Restate server. 

Read the [Restate documentation](https://github.com/restatedev/documentation) for the details on AWS Lambda deployment.

## Launch the Restate Runtime and call the Service

### Launch the Restate runtime

Have a look at how to start up the runtime in a Docker container in this repository: https://github.com/restatedev/restate-dist or simply run the following commands:

- For MacOS:
```shell
docker run --name restate_dev --rm -p 8081:8081 -p 9091:9091 -p 9090:9090 ghcr.io/restatedev/restate-dist:0.1.1
```
- For Linux:
```shell
docker run --name restate_dev --rm --network=host ghcr.io/restatedev/restate-dist:0.1.1
```

### Connect Services and Runtime

Once the runtime is up, let it discover your services by executing:

- For MacOS:
```shell
curl -X POST http://localhost:8081/services/discover -H 'content-type: application/json' -d '{"uri": "http://host.docker.internal:8080"}'
```
- For Linux:
```shell
curl -X POST http://localhost:8081/services/discover -H 'content-type: application/json' -d '{"uri": "http://localhost:8080"}'
```

### Call the Service

We can now invoke the `SampleCall` method by executing:

```shell
curl -X POST http://localhost:9090/org.example.ExampleService/SampleCall -H 'content-type: application/json' -d '{"request": "Pete"}'
```

You can see that we include the JSON encoded request body.
When you are extending or adapting the service interface, adapt the method and request body accordingly.

That's it! We managed to run a Restate service and invoke it!

# Useful links
- Restate Typescript SDK: https://github.com/restatedev/sdk-typescript
- Restate Docker container: https://github.com/restatedev/restate-dist
- The Restate documentation: https://github.com/restatedev/documentation
- Node dev mode: https://github.com/restatedev/node-dev-mode


# Contributing to this template

The template that is generated by the `npx @restatedev/create-app` command consists of exactly the
files that are in the `template` folder. To adjust or extend the template, simply edit or add files in
that folder.

Please take care to not commit unnecessary build artifacts when extending the template
(and adjust `.gitignore` accordingly).

## Releasing
### Upgrading Typescript SDK 
- Upgrade the version tag in `template/package.json`.
- Run the app to check if everything works
- Test the template build with `npm run build-template`
- Release the new template generator via `npm run release`

### Upgrading Restate runtime
Upgrade the version tag of the Restate runtime container image in this readme.