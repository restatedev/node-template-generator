[![Documentation](https://img.shields.io/badge/doc-reference-blue)](https://docs.restate.dev)
[![Examples](https://img.shields.io/badge/view-examples-blue)](https://github.com/restatedev/examples)
[![Discord](https://img.shields.io/discord/1128210118216007792?logo=discord)](https://discord.gg/skW3AZ6uGd)
[![Twitter](https://img.shields.io/twitter/follow/restatedev.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=restatedev)

# Restate Template for TypeScript / NodeJS services

This is a template for a [Restate-based](https://restate.dev/) service in [TypeScript](https://www.typescriptlang.org/).

## tl;dr

To create a template service, use this sequence of commands:

```shell
npx -y @restatedev/create-app@latest
cd restate-node-template

npm install

npm run app-dev
```

## gRPC Variant

The sequence of commands above creates a template for Restate's default TypeScript API.
To create a template for gRPC-based Restate services, use the following sequence instead:

```shell
npx -y @restatedev/create-app@latest --grpc
cd restate-node-grpc-template

npm install
npm run proto

npm run app-dev
```

## Detailed Step-by-Step Walkthrough

The templated project uses the [Restate TypeScript SDK](https://github.com/restatedev/sdk-typescript)
and sets up dependencies, and other useful scripts.

This template also contains a minimal runnable example of a Restate service. First, run the example to get an idea of how things tie together. Then, adapt the example and develop your own services.

### Pre-requisites

- [NodeJS (and npm)](https://nodejs.org) installed.
- [Docker Engine](https://docs.docker.com/engine/install/) to launch the Restate runtime (not needed for the app implementation itself).

### Create the template and install dependencies

We use the `@restatedev/create-app` template generator program. This gives you the raw project, with the
Restate SDK dependency, (optionally a simple protobuf setup), and a sample application.

For the default Restate API, use these commands:

```shell
npx -y @restatedev/create-app
cd restate-node-template
```

For the gRPC-based API, use the following commands instead:

```shell
npx -y @restatedev/create-app --grpc
cd restate-node-grpc-template
```

Next, install the dependencies:

```shell
npm install
```

### Optionally, edit and compile the gRPC spec

Restate services are RPC handlers, and can optionally be defined in [gRPC](https://grpc.io/).
If you used the `--grpc` flag when generating the template, you have a `proto` folder with a sample gRPC service definition (`example.proto` is the main file, the others are for the proto compiler tool).

To generate the TypeScript interfaces for the services, run:

```
npm run proto
```

### Implement, build, and run

The example in `src/app.ts` shows the basic outline of a Restate-based service/app.

The service logic lives in rpc handlers. In Restate's default API, those are just functions that are registered
with names and routes when setting up the service's http2 server. For the gRPC-based API, services implement the
interfaces generated from the gRPC .proto file.

Once you are done with the implementation, build/run the app with:

```
npm run build
npm run app
```

Your Restate service deployment is now up and running! You can also run in incremental-recompile-on-edit mode via
`npm run app-dev`.

## Run a full setup locally

### Launch the Restate Server

Have a look at the options for downloading Restate [here](https://restate.dev/get-restate/) or run one of the following commands:

- To run Restate in a Docker container:
    ```shell
    docker run --name restate_dev --rm -p 8080:8080 -p 9070:9070 -p 9071:9071 --add-host=host.docker.internal:host-gateway docker.io/restatedev/restate:latest
    ```
- To run Restate with `npx`:
    ```shell
    npx @restatedev/restate-server@latest
    ```
- To run Restate with Homebrew:
    ```
    brew install restatedev/tap/restate-server
    ```

### Register the service deployment in Restate

Once Restate is up, register the service deployment in Restate by executing:

- Via the [CLI](https://docs.restate.dev/operate/cli):
    ```shell
    restate dp register localhost:9080
    ```
  When running Restate with Docker, use `host.docker.internal` instead of `localhost` for the service deployment URI.
- Via `curl`:
    ```shell
    curl localhost:9070/deployments  -H 'content-type: application/json' -d '{"uri": "http://localhost:9080"}'
    ```
  When running Restate with Docker, use `host.docker.internal` instead of `localhost` for the service deployment URI.

### Call the Service

We can now invoke the sample method by executing:

```shell
curl -X POST http://localhost:8080/myservice/hello -H 'content-type: application/json' -d '{"request": "Pete"}'
```

For the gRPC-based template, use the following command instead:

```shell
curl -X POST http://localhost:8080/org.example.ExampleService/SampleCall -H 'content-type: application/json' -d '{"request": "Pete"}'
```

You can see that we include the JSON encoded request body.
When you are extending or adapting the service interface, adapt the method and request body accordingly.

That's it! We managed to run a Restate service and invoke it!

# Useful links

- Restate Typescript SDK: https://github.com/restatedev/sdk-typescript
- The Restate documentation: https://docs.restate.dev/
- Restate Docker container: https://hub.docker.com/r/restatedev/restate

# Contributing to this template

The template that is generated by the `npx @restatedev/create-app` command consists of exactly the
files that are in the `template` folder, or in the `template_grpc` folder. To adjust or extend the
template, simply edit or add files in that folder.

Please take care to not commit unnecessary build artifacts when extending the template
(and adjust `.gitignore` accordingly).

### Upgrading Typescript SDK

- Upgrade the version tag in `template/package.json` and `template_grpc/package.json`
- Test the template builds with `npm run build-templates`
- Run the apps in the `/template` and `/template_grpc`directories to check if everything works: `npm run --prefix template app` `npm run --prefix template_grpc app`
- Create a new release

## Releasing

- Bump the version field in [template/package.json](template/package.json) and [template_grpc/package.json](template_grpc/package.json) to `X.Y.Z`

### Releasing via release-it

Releasing a new npm package from this repo requires:

- [SSH access configured for Github](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) in order to push commits and tags to GitHub
- A GitHub personal access token with access to https://github.com/restatedev/node-template-generator in your environment as `GITHUB_TOKEN` in order to create a Github release

```bash
npm run release
# now select what type of release you want to do and say yes to the rest of the options
```

The actual `npm publish` is run by GitHub actions once a GitHub release is created.

### Releasing manually

1. Create and push a tag of the form `vX.Y.Z` to the upstream repository
1. [Create a new GitHub release](https://github.com/restatedev/node-template-generator/releases)

Creating the GitHub release will trigger `npm publish` via GitHub actions.
