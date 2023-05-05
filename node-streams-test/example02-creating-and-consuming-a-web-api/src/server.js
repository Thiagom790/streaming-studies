import http from "http";
import { Readable } from "node:stream";
import { randomUUID } from "node:crypto";

function* run() {
  for (let index = 0; index < 99; index++) {
    const data = {
      id: randomUUID(),
      name: `Tiago-${index}`,
      at: Date.now(),
    };
    yield data;
  }
}

function handle(request, response) {
  //   const readableStream = Readable({
  //     read() {
  //       this.push("Hello");
  //       this.push("World!");
  //       this.push(null);
  //     },
  //   });

  const readableStream = Readable({
    read() {
      for (const data of run()) {
        this.push(JSON.stringify(data).concat("\n"));
      }

      //   just saying that the stream has finished
      this.push(null);
    },
  });

  readableStream.pipe(response);
}

http
  .createServer(handle)
  .listen(3000)
  .on("listening", () => console.log("listening on port 3000"));
