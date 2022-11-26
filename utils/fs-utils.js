import fs from "node:fs/promises";

export async function writeFile(dirPath = "", fileName = "", content = "") {
  await fs.access(dirPath).catch(() => {
    fs.mkdir(dirPath);
  });

  const fullPath = `${dirPath}/${fileName}`;
  await fs.writeFile(fullPath, content).catch((err) => {
    console.error(err);
  });
}

export async function removeFile(filePath = "") {
  await fs.unlink(filePath).catch((err) => {
    console.error(err);
  });
}
