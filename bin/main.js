#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

console.log("Creating Restate project template for TypeScript...");

async function unzipTemplate() {
  const templatePath = path.join(__dirname, "..", "data", "node-template.zip");
  const outputPath = process.cwd();

  await fs
    .createReadStream(templatePath)
    .pipe(unzipper.Extract({ path: outputPath }))
    .promise();
}

unzipTemplate()
  .then(() => {
    console.log("...Done");
  })
  .catch((err) => {
    console.error("Failed to unzip project template: " + err);
    console.error(err.stack);
  });
