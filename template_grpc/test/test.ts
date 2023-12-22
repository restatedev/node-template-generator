import {GenericContainer, StartedTestContainer, TestContainers, Wait} from "testcontainers";
import * as restate from "@restatedev/restate-sdk";
import {protoMetadata} from "../src/generated/proto/example";
import {MyExampleService} from "../src/app";
import {createPromiseClient, Transport} from "@connectrpc/connect";
import {createConnectTransport} from "@connectrpc/connect-node";
import {ExampleService} from "./generated/example_connect";

async function prepareRestateTestEnvironment(mountServicesFn: (server: restate.RestateServer) => void): Promise<StartedTestContainer> {
    const restateContainer = new GenericContainer("docker.io/restatedev/restate:latest")
        // Expose ports
        .withExposedPorts(8080, 9070)
        // Wait start on health checks
        .withWaitStrategy(
            Wait.forAll([
                Wait.forHttp("/grpc.health.v1.Health/Check", 8080),
                Wait.forHttp("/health", 9070),
            ])
        );

    // This MUST be executed before starting the restate container
    // Expose host port to access the restate server
    await TestContainers.exposeHostPorts(9080);

    // Start restate container
    const startedRestateContainer = await restateContainer.start();

    // From now on, if something fails, stop the container to cleanup the environment
    try {
        const restateServer = restate.createServer()
        mountServicesFn(restateServer);

        // TODO bad, fix this once https://github.com/restatedev/sdk-typescript/issues/220 is done
        // Also we have no way to stop this server :(
        restateServer.listen(9080);

        console.info("Going to register");

        // Register this service endpoint
        const res = await fetch(`http://${startedRestateContainer.getHost()}:${startedRestateContainer.getMappedPort(9070)}/endpoints`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // See https://node.testcontainers.org/features/networking/#expose-host-ports-to-container
                uri: "http://host.testcontainers.internal:9080"
            }),
        });
        if (!res.ok) {
            const badResponse = await res.text();
            throw new Error(`Error ${res.status} during registration: ${badResponse}`)
        }

        console.info("Registered");
        return startedRestateContainer;
    } catch (e) {
        await startedRestateContainer.stop();
        throw e;
    }
}

describe("ExampleService", () => {
    let startedRestateContainer: StartedTestContainer;
    let clientTransport: Transport;

    beforeAll(async () => {
        startedRestateContainer = await prepareRestateTestEnvironment(
            (restateServer) => restateServer.bindService(
                {
                    service: "ExampleService",
                    instance: new MyExampleService(),
                    descriptor: protoMetadata,
                }
            )
        );

        clientTransport = createConnectTransport({
            baseUrl: `http://${startedRestateContainer.getHost()}:${startedRestateContainer.getMappedPort(8080)}`,
            httpVersion: "1.1"
        });

    }, 10_000);

    afterAll(async () => {
        await startedRestateContainer.stop()
    });

    it("works", async () => {
        const serviceClient = createPromiseClient(ExampleService, clientTransport);
        const result = await serviceClient.sampleCall({request: "Francesco"});
        expect(result.response).toBe("Hello Francesco");
    });
});