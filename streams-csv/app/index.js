const API_URL = "http://localhost:3000";
let counter = 0;

async function consumeApi(signal) {
  const response = await fetch(API_URL, {
    signal,
  });

  const reader = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(parseNDJSON());
  // .pipeTo(
  //   new WritableStream({
  //     write(chunk) {
  //       console.log(++counter, "chunk", chunk);
  //     },
  //   })
  // );

  return reader;
}

/* essa função vai se certificar que caso dois chunks cheguem em uma única transmissão
 * converta corretamente para JSON
 * dado:{}\n{}
 * deve:
 *     {}
 *     {}
 */
function parseNDJSON() {
  let ndJsonBuffer = "";
  return new TransformStream({
    transform(chunk, controller) {
      ndJsonBuffer += chunk;
      const itens = ndJsonBuffer.split("\n");

      itens
        .slice(0, -1)
        .forEach((item) => controller.enqueue(JSON.parse(item)));

      ndJsonBuffer = itens[itens.length - 1];
    },
    flush(controller) {
      if (!ndJsonBuffer) return;
      controller.enqueue(JSON.parse(ndJsonBuffer));
    },
  });
}

function appendToHTML(element) {
  return new WritableStream({
    write({ title, description, url_anime }) {
      const card = ` 
        <article>
          <div class="text">
            <h3>[${++counter}] ${title}</h3>
            <p>${description.slice(0, 100)}</p>
            <a href="${url_anime}">heres why</a>
          </div>
        </article>`;

      element.innerHTML += card;
    },
    abort(reason) {
      console.log("abortado", reason);
    },
  });
}

const [start, stop, cards] = ["start", "stop", "cards"].map((id) =>
  document.getElementById(id)
);

let abortController = new AbortController();

start.addEventListener("click", async () => {
  const readable = await consumeApi(abortController.signal);
  readable.pipeTo(appendToHTML(cards));
});

stop.addEventListener("click", () => {
  // ele cancela todas as operações que eu passei o signal
  abortController.abort();
  console.log("abortado...");
  abortController = new AbortController();
});
