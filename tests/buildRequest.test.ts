import * as test from "tape";

import { RequestCheat, DFCheatRequestInput } from "../src";

let client: any;
let session: string = `1589863492594-6871437172438579`;
let languageCode: string;
test("setup", function (t) {
  languageCode = "en_US"; // (optonal), defauls to 'en_US'
  const transformgrpc = false; // (optional)
  const backend = `http://localhost:8000/chat`;
  const config = {
    session,
    languageCode,
    transformgrpc,
    backend,
    debug: true,
  };
  client = new RequestCheat(config);

  t.end();
});

test("<buildRequest, text>", async (t: any) => {
  const text = `hi`;
  const actual = client.buildRequest(text);
  const expected = {
    session: "1589863492594-6871437172438579",
    queryInput: { text: { text: "hi", languageCode: "en_US" } },
  };

  t.deepEqual(actual, expected);
});

test("<buildRequest, text>", async (t: any) => {
  const text = `hi`;
  const actual = client.buildRequest(text);
  const expected = {
    session: "1589863492594-6871437172438579",
    queryInput: { text: { text: "hi", languageCode: "en_US" } },
  };

  t.deepEqual(actual, expected);
});

test("<buildRequest, text, payload>", async (t: any) => {
  const payload: DFCheatRequestInput = {
    kind: "text",
    content: "hi",
  };
  const actual = client.buildRequest(payload);
  const expected = {
    session: "1589863492594-6871437172438579",
    queryInput: { text: { text: "hi", languageCode: "en_US" } },
  };

  t.deepEqual(actual, expected);
});

test("<buildRequest, event, parameters>", async (t: any) => {
  const payload: DFCheatRequestInput = {
    kind: "event",
    content: {
      name: "my_event",
      languageCode: "en_US",
      parameters: { a: 1, b: 2, c: 3 },
    },
  };

  const actual = client.buildRequest(payload);
  const expected = {
    session: "1589863492594-6871437172438579",
    queryInput: {
      event: {
        name: "my_event",
        parameters: { a: 1, b: 2, c: 3 },
        languageCode: "en_US",
      },
    },
  };

  t.deepEqual(actual, expected);
});

test("<buildRequest, event, parameters & requestData>", async (t: any) => {
  const payload: DFCheatRequestInput = {
    kind: "event",
    content: {
      name: "my_event",
      languageCode: "en_US",
      parameters: { a: 1, b: 2, c: 3 },
    },
    requestData: { x: 5, y: 6, z: 9 },
  };

  const actual = client.buildRequest(payload);
  const expected = {
    session: "1589863492594-6871437172438579",
    queryInput: {
      event: {
        name: "my_event",
        parameters: { a: 1, b: 2, c: 3 },
        languageCode: "en_US",
      },
    },
    queryParams: { payload: { x: 5, y: 6, z: 9 } },
  };

  t.deepEqual(actual, expected);
});

test("<buildRequest, event, parameters, [transform]>", async (t: any) => {
  client.updateTransformgrpc(true);
  const payload: DFCheatRequestInput = {
    kind: "event",
    content: {
      name: "my_event",
      languageCode: "en_US",
      parameters: { a: 1, b: 2, c: 3 },
    },
  };

  const actual = client.buildRequest(payload);
  const expected = {
    session: "1589863492594-6871437172438579",
    queryInput: {
      event: {
        name: "my_event",
        parameters: {
          fields: {
            a: { kind: "numberValue", numberValue: 1 },
            b: { kind: "numberValue", numberValue: 2 },
            c: { kind: "numberValue", numberValue: 3 },
          },
        },
        languageCode: "en_US",
      },
    },
  };
  client.updateTransformgrpc(false);

  t.deepEqual(actual, expected);
});

test("<buildRequest, event, parameters & requestData [transform]>", async (t: any) => {
  client.updateTransformgrpc(true);

  const payload: DFCheatRequestInput = {
    kind: "event",
    content: {
      name: "my_event",
      languageCode: "en_US",
      parameters: { a: 1, b: 2, c: 3 },
    },
    requestData: { x: 5, y: 6, z: 9 },
  };

  const actual = client.buildRequest(payload);
  const expected = {
    session: "1589863492594-6871437172438579",
    queryInput: {
      event: {
        name: "my_event",
        parameters: {
          fields: {
            a: { kind: "numberValue", numberValue: 1 },
            b: { kind: "numberValue", numberValue: 2 },
            c: { kind: "numberValue", numberValue: 3 },
          },
        },
        languageCode: "en_US",
      },
    },
    queryParams: {
      payload: {
        fields: {
          x: { kind: "numberValue", numberValue: 5 },
          y: { kind: "numberValue", numberValue: 6 },
          z: { kind: "numberValue", numberValue: 9 },
        },
      },
    },
  };

  t.deepEqual(actual, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
