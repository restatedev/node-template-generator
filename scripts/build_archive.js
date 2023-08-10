"use strict";

const fs = require("fs");
const path = require("path");
const util = require("util");
const archiver = require("archiver");

async function createDirIfNotExists(path) {
  const mkdir = util.promisify(fs.mkdir);
  try {
    await mkdir(path, { recursive: true, mode: "755" });
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
}

async function buildArchive(templateDir, filename, archiveFolder) {
  const outDirPath = path.join(__dirname, "..", "data");
  await createDirIfNotExists(outDirPath);

  const outFilePath = path.join(outDirPath, filename + ".zip");
  const output = fs.createWriteStream(outFilePath);

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("warning", (err) => {
    if (err.code === "ENOENT") {
      console.warn(err);
    } else {
      throw err;
    }
  });
  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(templateDir + "/", archiveFolder);

  await archive.finalize();
  console.log(`Zip archive is ${archive.pointer()} bytes in size.`);
}

async function buildBothArchives() {
  await buildArchive("template", "node-template", "restate-node-template");
  await buildArchive(
    "template_grpc",
    "node-grpc-template",
    "restate-node-grpc-template"
  );
}

console.log("Creating archive with template...");
buildBothArchives()
  .then(() => {
    console.log("Done.");
  })
  .catch((err) => {
    console.error("Failed to create zip archive with template: " + err);
    console.error(err.stack);
  });
