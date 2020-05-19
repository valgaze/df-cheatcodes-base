/*
import { RequestCheat } from "./../src";
const session = `1589863492594-6871437172438579`;
const languageCode = "en_US"; // (optonal), defauls to 'en_US'
const transformgrpc = true; // (optional)
const backend = `http://localhost:8000/chat`;
const config = {
  session,
  languageCode,
  transformgrpc,
  backend,
  debug: true,
};
const client = new RequestCheat(config);
const payload = {
  kind: "event",
  content: {
    name: "my_event",
    languageCode: "en_US",
    parameters: { a: 1, b: 2, c: 3 },
  },
  requestData: { x: 5, y: 6, z: 9 },
};
//@ts-ignore
console.log("\n#", JSON.stringify(client.buildRequest(payload)));

// const expected = {
//   session: "1589863408771-6121746998651258",
//   queryInput: { text: { text: "hi", languageCode: "en_US" } },
// };
*/
