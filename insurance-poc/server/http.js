import { createServer } from "node:http";
import { createWriteStream } from "node:fs";
import { Readable, Writable, Transform } from "stream";
import { WritableStream, TransformStream } from "node:stream/web";

const PORT = 3003;

createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  // if (req.method === "POST") {
  //   var body = "";
  //   req.on("data", function (data) {
  //     body += data;
  //     writer.write(data);
  //   });
  //   req.on("end", function () {
  //     console.log("end");
  //   });
  // }

  let lines = 0;
  if (req.method === "POST") {
    console.log("Entrou");
    req
      .pipe(
        Transform({
          transform(chunk, encoding, callback) {
            lines++;
            // console.log("chunk", { lines, chunk: chunk.toString() });
            console.log("finish", { lines, chunk: chunk.toString() });
            callback(null, chunk);
          },
        })
      )
      // .pipe(
      //   Writable({
      //     write(chunk, encoding, callback) {
      //       console.log("chunk", { lines, chunk: chunk.toString() });
      //       callback();
      //     },
      //   })
      // );
      .pipe(createWriteStream("./log.csv", { flags: "a" }));
    // .on("finish", () => {
    //   console.log("finish", { lines });
    // });
  }

  res.writeHead(200, headers);
  res.end(JSON.stringify({ status: "ok" }));
})
  .listen(PORT)
  .on("listening", () => {
    console.log(`Server running on port ${PORT}`);
  });
