const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/frame", (req, res) => {
  res.send("<h1>WarpWin Minesweeper Frame</h1>");
});

app.post("/frame/action", (req, res) => {
  res.json({
    type: "frame",
    frame_url: "https://warpwin-game.vercel.app", // gerçek frontend URL'in buraya
  });
});

app.listen(3001, () => {
  console.log("✅ Frame server running at http://localhost:3001/frame");
});
