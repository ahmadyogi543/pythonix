import express from "express";
import cors from "cors";
import helmet from "helmet";

import { router as rootRouter } from "./routes/root.js";

const HOSTNAME = process.env.HOSTNAME || "localhost";
const PORT = process.env.PORT || 3000;

const app = express();

/* middleware */
app.use(cors());
app.use(helmet());
app.use(express.static("public"));
app.use(express.json());

/* routes */
app.use("/api/v1", rootRouter);

/* start app */
app.listen(PORT, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}...`);
});
