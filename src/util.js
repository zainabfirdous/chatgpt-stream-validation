import { fetchEventSource } from "@sameer-j/react-fetch-event-source";

export const DONE_CHUNK = "[DONE]";

let buffer = ""; //global scope buffer variable to store json response streaming from server
export const fetchAIData = async ({
  aiGenerationType,
  aiGeneratorInput,
  dataUpdaterWithChunk,
  abortController,
}) => {
  try {
    const { url, method, body } = getApiDetails(aiGenerationType, aiGeneratorInput);

    await fetchEventSource(url, {
      method,
      body,
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
      openWhenHidden: true,
      async onopen() {
        //console.log("Open SSE connection."); // DND: This is needed for debugging in future.
      },
      onmessage(event) {
        if (event.data !== DONE_CHUNK) {
          const { chunkMessage } = JSON.parse(event?.data || "");
          buffer += chunkMessage; 
          //calls function to set job description state only when content property is receieved from server until we reach the end of content property.
          if (buffer.indexOf("content") !== -1 && buffer.indexOf("}") === -1) {
            dataUpdaterWithChunk({ chunk: chunkMessage });
          }
        } else {
          dataUpdaterWithChunk({ chunk: DONE_CHUNK });
          buffer = ""; //clear buffer for regeneration
          abortController.abort();
          //console.log("Not message:, closing connection"); // DND: This is needed for debugging in future.
        }
      },
      onerror(error) {
        dataUpdaterWithChunk({ chunk: DONE_CHUNK });
        console.log("onerror:", error); // DND: This is needed for debugging in future.
        throw new Error(error);
      },
      onclose() {
        //console.log("Server closed connection, closing from client now:"); // DND: // This is needed for debugging in future.
        dataUpdaterWithChunk({ chunk: DONE_CHUNK });
        buffer = "";
        abortController.abort();
      },
    });
  } catch (err) {
    console.log(err);
    dataUpdaterWithChunk({ chunk: DONE_CHUNK });
  }
};

const getApiDetails = (aiGenerationType, aiGeneratorInput) => {
  const AI_BASE_URL = `http://localhost:8001/ai-completion`;
  const { companyName, jobLocation, jobTitle } = aiGeneratorInput;
  return {
    url: `${AI_BASE_URL}/jd`,
    method: "PUT",
    body: JSON.stringify({
      companyName,
      jobLocation,
      jobTitle,
    }),
  };
};
