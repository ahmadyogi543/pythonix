import path from "path";
import { spawn, exec } from "child_process";
import { v4 as getUUID } from "uuid";

import { writeFile, removeFile } from "./fs-utils.js";
import { getDirPath } from "./path-utils.js";

const COMPILER = {
  executable: "python",
  fileExtension: "py",
};
const TIMEOUT = 15;
const DIR_PATH = getDirPath(import.meta.url);

export async function checkVersion() {
  const version = await new Promise((resolve, reject) => {
    exec(`${COMPILER.executable} --version`, (error, stdout, stderr) => {
      if (error || stderr) {
        reject("error");
      }
      resolve(stdout);
    });
  });
  return version.split(" ")[1].replace(/\n/g, "");
}

export async function createCode(code = "") {
  try {
    const dirPath = `${path.join(DIR_PATH, "../code")}`;
    const fileName = `${getUUID()}.${COMPILER.fileExtension}`;
    await writeFile(dirPath, fileName, code);

    return `${dirPath}/${fileName}`;
  } catch (err) {
    console.error(err);
  }
}

export async function deleteCode(codePath = "") {
  await removeFile(codePath);
}

export async function executeCode(filePath = "", input) {
  try {
    const { output } = await new Promise((resolve, reject) => {
      const executer = spawn(COMPILER.executable, [filePath]);

      if (input) {
        executer.stdin.write(input);
      }
      executer.stdin.end();

      let outputStr = "";
      executer.stdout.on("data", (data) => {
        outputStr += data.toString();
      });

      let errorStr = "";
      executer.stderr.on("data", (data) => {
        errorStr += data.toString();
      });

      setTimeout(() => {
        executer.kill();
        reject({
          output: `Error: Time-out. Your code took too long to execute, over ${TIMEOUT} seconds.`,
        });
      }, TIMEOUT * 1000);

      executer.on("exit", () => {
        if (!errorStr) {
          resolve({
            output: outputStr,
          });
        } else {
          reject({
            output: errorStr,
          });
        }
      });
    });

    return {
      status: "success",
      output,
      timestamp: Date.now(),
    };
  } catch (err) {
    return {
      status: "failed",
      output: err.output,
      timestamp: Date.now(),
    };
  }
}
