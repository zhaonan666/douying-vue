import express from "express";
import videoRouter from "./routes/video.js";
import cors from "cors";

const port = 3300;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/video", videoRouter);

app.listen(port, () => {
  console.log("this server running at http://localhost:3300");
});
