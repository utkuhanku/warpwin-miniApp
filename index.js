import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/frame", (req, res) => {
  res.json({
    title: "💣 WarpWin - Minesweeper",
    description: "0.001 ETH öde, tüm bombaları geç, 0.1 ETH kazan!",
    image: "https://your-ngrok-url.com/frame-preview.png",
    post_url: "https://your-ngrok-url.com/frame/action",
    buttons: [
      { label: "Play WarpWin", action: "post" },
    ]
  });
});

app.post("/frame/action", (req, res) => {
  return res.json({
    type: "frame",
    frame_url: "https://warpwin-game.vercel.app",
  });
});

app.listen(3001, () => {
  console.log("✅ Frame server running at http://localhost:3001/frame");
});
