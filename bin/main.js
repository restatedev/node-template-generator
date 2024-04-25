#!/usr/bin/env node

const unzipper = require("unzipper");
const fs = require("fs/promises");

async function main() {
  console.log(`Creating Restate project template for TypeScript...`);

  const TEMPLATE_LOCATION =
    "https://github.com/restatedev/examples/releases/latest/download/typescript-hello-world.zip";

  const response = await fetch(TEMPLATE_LOCATION);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }

  // https://github.com/ZJONSSON/node-unzipper/issues/292
  const responseBodyBuffer = Buffer.from(
    new Uint8Array(await response.arrayBuffer())
  );

  const outputPath = process.cwd() + "/restate-node-template";
  await fs.mkdir(outputPath, { recursive: true });

  const zip = await unzipper.Open.buffer(responseBodyBuffer);
  await zip.extract({ path: outputPath });

  console.log("...Done");
}

// POSIX compliant apps should report an exit status
main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err); // Writes to stderr
    process.exit(1);
  });
