import {
  createCode,
  deleteCode,
  executeCode,
  checkVersion,
} from "../utils/index.js";

export function rootController(_, res) {
  const data = {
    message: `Welcome to Pythonix, you can use /execute endpoint to execute your python code`,
  };
  res.send(data);
}

export async function versionController(_, res) {
  try {
    const version = await checkVersion();
    const data = {
      language: "python",
      version: version,
    };
    res.send(data);
  } catch (err) {
    console.error(err);
  }
}

export async function executeController(req, res) {
  try {
    const { code, input } = req.body;

    const codePath = await createCode(code);
    const result = await executeCode(codePath, input);
    deleteCode(codePath).then(() => {
      res.send(result);
    });
  } catch (err) {
    res.status(500).send({
      message: "500: Internal server error",
    });
  }
}
