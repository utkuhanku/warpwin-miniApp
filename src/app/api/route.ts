import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cell = searchParams.get("cell") ?? "none";

  const body = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>WarpWin Frame</title>
        <meta property="og:title" content="WarpWin 🧨 Minesweeper" />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="https://warpwin.xyz/static/minesweeper.jpg" />
        <meta name="fc:frame:button:1" content="A1" />
        <meta name="fc:frame:button:2" content="B2" />
        <meta name="fc:frame:button:3" content="C3" />
        <meta name="fc:frame:button:4" content="Restart" />
        <meta name="fc:frame:post_url" content="https://warpwin.xyz/api/frame" />
      </head>
      <body>
        <h1>You clicked: ${cell}</h1>
      </body>
    </html>
  `;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html"
    }
  });
}
