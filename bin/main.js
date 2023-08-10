#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

async function unzipTemplate(grpc) {
  const archiveName = grpc ? "node-grpc-template.zip" : "node-template.zip";
  const templatePath = path.join(__dirname, "..", "data", archiveName);
  const outputPath = process.cwd();

  await fs
    .createReadStream(templatePath)
    .pipe(unzipper.Extract({ path: outputPath }))
    .promise();
}

let grpcVariant = false;
process.argv.slice(2).forEach((arg) => {
  if (arg === "--grpc") {
    grpcVariant = true;
  } else {
    console.error("Unrecognized argument: " + arg);
    process.exit(1);
  }
});

console.log(
  `Creating Restate project template for TypeScript ${
    grpcVariant ? "(gRPC version)" : ""
  }...`
);

unzipTemplate(grpcVariant)
  .then(() => {
    console.log("...Done");
  })
  .catch((err) => {
    console.error("Failed to unzip project template: " + err);
    console.error(err.stack);
  });
