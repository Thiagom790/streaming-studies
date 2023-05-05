import { createWriteStream } from "node:fs";
import { get } from "node:http";
import { Transform, Writable } from "node:stream";

const url = "http://localhost:3000";

const getHttpStream = () =>
  new Promise((resolve) => get(url, (response) => resolve(response)));

const stream = await getHttpStream();

stream
  .pipe(
    // it could be a transform a map function
    Transform({
      // this will be force the stream to use strings instead of buffers
      objectMode: true,
      transform(chunk, encoding, callback) {
        //   console.log("chunk", JSON.parse(chunk));
        const item = JSON.parse(chunk);

        const myNumber = /\d+/.exec(item.name)[0];
        const isEven = myNumber % 2 === 0;
        item.name = item.name.concat(isEven ? " is even" : " is odd");

        // error first parameter / success second parameter
        callback(null, JSON.stringify(item));
      },
    })
  )
  .filter((chunk) => chunk.includes("is even"))
  .map((chunk) => chunk.toUpperCase() + "\n")
  //   flag "a" means append data if existent
  .pipe(createWriteStream("response.log", { flags: "a" }));
// writable stream cold be last step, and we can't have two writable streams on the same pipeline
//   .pipe(
//     Writable({
//       objectMode: true,
//       write(chunk, encoding, callback) {
//         console.log("chunk", chunk);

//         return callback();
//       },
//     })
//   );
//   .pipe(process.stdout);
