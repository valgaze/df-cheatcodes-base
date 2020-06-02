## install it!

```
npm i df-cheatcodes-base --save
```

## use it!

ex. a rich frontend interface (like **[df-cheatchat](https://github.com/valgaze/df-cheatchat)**)

```ts
import { RequestCheat } from "df-cheatcodes-base";

async function main() {
  const session = RequestCheat.buildSessionId();
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

  // This can also send events, request data, see buildRequest
  const chatRes = await client.send(`Hi!!!`);
  // Strip everything except components & transform since gRPC is true
  const tidyResult = client.simplifyResponse(chatRes.data);
  // Generate components
  const componentRoster = client.generateComponents(tidyResult); // {suggestions, components}
  const { components, suggestions, linkoutSuggestion } = componentRoster;
  // suggestions (max of 8) are all suggestions combined (ie from webhookPayload, fulfillment messages, etc)
  // components are all components filtered appropriately (easier to build a frontend w/ that list)
  // linkoutSuggestion is single "chip": https://developers.google.com/assistant/conversational/rich-responses#suggestion_chips
}
main();
```
