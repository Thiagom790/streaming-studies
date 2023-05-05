const button = document.querySelector("button");
const fileInput = document.querySelector("input[type=file]");

button.addEventListener("click", async () => {
  /*  function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  const stream = new ReadableStream({
    async start(controller) {
      await wait(1000);
      controller.enqueue("This ");
      await wait(1000);
      controller.enqueue("is ");
      await wait(1000);
      controller.enqueue("a ");
      await wait(1000);
      controller.enqueue("slow ");
      await wait(1000);
      controller.enqueue("request.");
      controller.close();
    },
  }).pipeThrough(new TextEncoderStream()) */

  const file = fileInput.files[0];

  let line = 0;
  const fileStream = file
    .stream()
    .pipeThrough(new TextDecoderStream())
    .pipeTo(
      new WritableStream({
        write(chunk) {
          line++;
          console.log(line, "chunk", chunk);
        },
      })
    );

  const response = await fetch("https://localhost:3003/upload", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: fileStream,
    duplex: "half",
  });

  console.log("response", await response.json());
});
