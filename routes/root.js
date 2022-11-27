import express from "express";

import {
  createCode,
  deleteCode,
  executeCode,
  checkVersion,
} from "../utils/index.js";

const router = express.Router();

router.get("/", (req, res) => {
  const data = {
    message: `Welcome to Pythonix, you can use /execute endpoint to execute your python code`,
  };
  res.send(data);
});

router.get("/version", async (req, res) => {
  const version = await checkVersion();
  const data = {
    language: "python",
    version: version,
  };
  res.send(data);
});

router.post("/execute", async (req, res) => {
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
});

export { router };
