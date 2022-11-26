import path from "path";
import { fileURLToPath } from "url";

export function getDirPath(fileURL = "") {
  return path.dirname(fileURLToPath(fileURL));
}

export function getFilePath(fileURL = "") {
  return fileURLToPath(fileURL);
}
