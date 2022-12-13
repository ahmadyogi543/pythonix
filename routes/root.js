import express from "express";

import {
  rootController,
  versionController,
  executeController,
} from "../controllers/index.js";

const router = express.Router();

router.get("/", rootController);

router.get("/version", versionController);

router.post("/execute", executeController);

export { router };
