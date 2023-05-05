// 1 - terminal inputs

// const stdin = process.stdin.on("data", (msg) =>
//   console.log("terminal input was", msg)
// );

// const stdin = process.stdin;

// const stdout = process.stdout.on("data", (msg) =>
//   process.stdout.write(msg.toString().toUpperCaspe())
// );

// stdin.pipe(stdout);

// 2
// node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file
// curl -v -o grande.big localhost:3000
import http from "http";
import { readFileSync, createReadStream } from "fs";

http
  .createServer((request, response) => {
    // const file = readFileSync("./big.file");
    // response.write(file);
    // response.end();
    createReadStream("./big.file").pipe(response);
  })
  .listen(3000)
  .on("listening", () => console.log("listening on 3000"));
