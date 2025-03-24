import express from "express";
import handler from "./api/blotter/route.js";

const app = express();

app.use(express.json());
app.use("/api/blotter", handler);

app.get("/", (req, res) => {
  res.send("Welcome to the Blotter API");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
