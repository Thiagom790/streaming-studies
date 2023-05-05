import http2 from "node:http2";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import handler from "serve-handler";

// openssl req -new -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
// openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
//
// http2 only works over HTTPS
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = http2.createSecureServer({
  cert: fs.readFileSync(path.join(__dirname, "/../server.crt")),
  key: fs.readFileSync(path.join(__dirname, "/../key.pem")),
});

server.on("stream", (stream, headers) => {
  const path = headers[":path"];

  if (path !== "/upload") {
    return;
  }

  stream.respond({
    "content-type": "application/json",
    ":status": 200,
  });

  stream.on("data", (chunk) => {
    console.log("chunk", chunk.toString());
  });

  stream.on("end", () => {
    console.log("stream ended");
  });

  stream.end(JSON.stringify({ message: "finished" }));
});

server.on("request", (req, res) => {
  const path = req.headers[":path"];

  if (path === "/upload") {
    return;
  }

  // handle the static assets
  return handler(req, res, {
    public: "./app",
  });
});

const port = 3003;
server.listen(port, () =>
  console.log(
    `Server running at https://localhost:${port} - make sure you're on httpS, not http`
  )
);
