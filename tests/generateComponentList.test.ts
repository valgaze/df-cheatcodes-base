import * as test from "tape";
import { RequestCheat } from "../src";

let client: any;
let session: string;
let languageCode: string;
let debug = true;
test("setup", function (t) {
  session = RequestCheat.buildSessionId();
  languageCode = "en_US"; // (optonal), defauls to 'en_US'
  const transformgrpc = true; // (optional)
  const backend = `http://localhost:8000/chat`;
  const config = {
    session,
    languageCode,
    transformgrpc,
    backend,
    debug,
  };
  client = new RequestCheat(config);

  t.end();
});

test("<Sanity test>", async (t: any) => {
  const res = Math.random();
  const clean = Boolean(res);
  const expected = true;

  t.deepEqual(clean, expected);
});

test("<generateComponents: creates rich component list from simplifyRespones (must be transformed)>", async (t: any) => {
  const rawResponse = {
    responseId: "449260ee-4c16-4a0b-9435-d5c84ad4d59a-e15c53b8",
    queryResult: {
      fulfillmentMessages: [
        {
          platform: "PLATFORM_UNSPECIFIED",
          text: { text: [""] },
          message: "text",
        },
      ],
      outputContexts: [
        {
          name:
            "projects/bongoagent-qmguth/agent/sessions/1589757712942-30537515439498986/contexts/_actions_on_google",
          lifespanCount: 99,
          parameters: {
            fields: { data: { stringValue: "{}", kind: "stringValue" } },
          },
        },
      ],
      queryText: "health",
      speechRecognitionConfidence: 0,
      action: "",
      parameters: { fields: {} },
      allRequiredParamsPresent: true,
      fulfillmentText: "",
      webhookSource: "",
      webhookPayload: {
        fields: {
          google: {
            structValue: {
              fields: {
                expectUserResponse: { boolValue: true, kind: "boolValue" },
                richResponse: {
                  structValue: {
                    fields: {
                      items: {
                        listValue: {
                          values: [
                            {
                              structValue: {
                                fields: {
                                  simpleResponse: {
                                    structValue: {
                                      fields: {
                                        textToSpeech: {
                                          stringValue:
                                            "Backend server is working at Sun May 17 2020 16:21:57 GMT-0700 (Pacific Daylight Time)",
                                          kind: "stringValue",
                                        },
                                      },
                                    },
                                    kind: "structValue",
                                  },
                                },
                              },
                              kind: "structValue",
                            },
                            {
                              structValue: {
                                fields: {
                                  basicCard: {
                                    structValue: {
                                      fields: {
                                        title: {
                                          stringValue: "Backend Server Working",
                                          kind: "stringValue",
                                        },
                                        image: {
                                          structValue: {
                                            fields: {
                                              url: {
                                                stringValue:
                                                  "https://cdn.sallysbakingaddiction.com/wp-content/uploads/2019/05/6-chocolate-chip-cookies.jpg",
                                                kind: "stringValue",
                                              },
                                              accessibilityText: {
                                                stringValue: "Mmm...",
                                                kind: "stringValue",
                                              },
                                            },
                                          },
                                          kind: "structValue",
                                        },
                                        subtitle: {
                                          stringValue: "The Backend is up!",
                                          kind: "stringValue",
                                        },
                                        formattedText: {
                                          stringValue:
                                            "Successful Health Check!",
                                          kind: "stringValue",
                                        },
                                        buttons: {
                                          listValue: {
                                            values: [
                                              {
                                                structValue: {
                                                  fields: {
                                                    openUrlAction: {
                                                      structValue: {
                                                        fields: {
                                                          url: {
                                                            stringValue:
                                                              "https://google.com/?q=chocolate+chip+cookies",
                                                            kind: "stringValue",
                                                          },
                                                        },
                                                      },
                                                      kind: "structValue",
                                                    },
                                                    title: {
                                                      stringValue: "Celebrate",
                                                      kind: "stringValue",
                                                    },
                                                  },
                                                },
                                                kind: "structValue",
                                              },
                                            ],
                                          },
                                          kind: "listValue",
                                        },
                                      },
                                    },
                                    kind: "structValue",
                                  },
                                },
                              },
                              kind: "structValue",
                            },
                          ],
                        },
                        kind: "listValue",
                      },
                    },
                  },
                  kind: "structValue",
                },
                userStorage: {
                  stringValue: '{"data":{}}',
                  kind: "stringValue",
                },
              },
            },
            kind: "structValue",
          },
        },
      },
      intent: {
        inputContextNames: [],
        events: [],
        trainingPhrases: [],
        outputContexts: [],
        parameters: [],
        messages: [],
        defaultResponsePlatforms: [],
        followupIntentInfo: [],
        name:
          "projects/bongoagent-qmguth/agent/intents/5701ca48-1325-455e-861d-4d52c0d68004",
        displayName: "health",
        priority: 0,
        isFallback: false,
        webhookState: "WEBHOOK_STATE_UNSPECIFIED",
        action: "",
        resetContexts: false,
        rootFollowupIntentName: "",
        parentFollowupIntentName: "",
        mlDisabled: false,
      },
      intentDetectionConfidence: 1,
      diagnosticInfo: {
        fields: {
          webhook_latency_ms: { numberValue: 313, kind: "numberValue" },
        },
      },
      languageCode: "en",
      sentimentAnalysisResult: null,
    },
    webhookStatus: {
      details: [],
      code: 0,
      message: "Webhook execution successful",
    },
    outputAudio: { type: "Buffer", data: [] },
    outputAudioConfig: null,
  };
  const simplifedResponse = client.simplifyResponse(rawResponse);
  const actual = client.generateComponents(simplifedResponse);
  const expected = {
    components: [
      {
        simpleResponse: {
          textToSpeech:
            "Backend server is working at Sun May 17 2020 16:21:57 GMT-0700 (Pacific Daylight Time)",
        },
      },
      {
        basicCard: {
          title: "Backend Server Working",
          image: {
            url:
              "https://cdn.sallysbakingaddiction.com/wp-content/uploads/2019/05/6-chocolate-chip-cookies.jpg",
            accessibilityText: "Mmm...",
          },
          subtitle: "The Backend is up!",
          formattedText: "Successful Health Check!",
          buttons: [
            {
              openUrlAction: {
                url: "https://google.com/?q=chocolate+chip+cookies",
              },
              title: "Celebrate",
            },
          ],
        },
      },
    ],
    suggestions: [],
  };

  t.deepEqual(actual, expected);
});

test("<generateComponents: creates rich component list (aog + fulfillment message) from simplifyRespones (must be transformed)>", async (t: any) => {
  const rawResponse = {
    responseId: "057d93f3-58fe-4040-8cb6-c96a59502e4d-e15c53b8",
    queryResult: {
      fulfillmentMessages: [
        {
          platform: "PLATFORM_UNSPECIFIED",
          text: { text: ["Good day! What can I do for you today?"] },
          message: "text",
        },
      ],
      outputContexts: [
        {
          name:
            "projects/bongoagent-qmguth/agent/sessions/1589757953613-539054011229446/contexts/_actions_on_google",
          lifespanCount: 99,
          parameters: {
            fields: { data: { stringValue: "{}", kind: "stringValue" } },
          },
        },
      ],
      queryText: "hi",
      speechRecognitionConfidence: 0,
      action: "input.welcome",
      parameters: { fields: {} },
      allRequiredParamsPresent: true,
      fulfillmentText: "Good day! What can I do for you today?",
      webhookSource: "",
      webhookPayload: {
        fields: {
          google: {
            structValue: {
              fields: {
                richResponse: {
                  structValue: {
                    fields: {
                      items: {
                        listValue: {
                          values: [
                            {
                              structValue: {
                                fields: {
                                  simpleResponse: {
                                    structValue: {
                                      fields: {
                                        textToSpeech: {
                                          stringValue:
                                            "Hey there, your random number is 0.3211999630329925",
                                          kind: "stringValue",
                                        },
                                      },
                                    },
                                    kind: "structValue",
                                  },
                                },
                              },
                              kind: "structValue",
                            },
                          ],
                        },
                        kind: "listValue",
                      },
                    },
                  },
                  kind: "structValue",
                },
                userStorage: {
                  stringValue: '{"data":{}}',
                  kind: "stringValue",
                },
                expectUserResponse: { boolValue: true, kind: "boolValue" },
              },
            },
            kind: "structValue",
          },
        },
      },
      intent: {
        inputContextNames: [],
        events: [],
        trainingPhrases: [],
        outputContexts: [],
        parameters: [],
        messages: [],
        defaultResponsePlatforms: [],
        followupIntentInfo: [],
        name:
          "projects/bongoagent-qmguth/agent/intents/83d3617e-d1f1-44df-941f-f4df230890a5",
        displayName: "Default Welcome Intent",
        priority: 0,
        isFallback: false,
        webhookState: "WEBHOOK_STATE_UNSPECIFIED",
        action: "",
        resetContexts: false,
        rootFollowupIntentName: "",
        parentFollowupIntentName: "",
        mlDisabled: false,
      },
      intentDetectionConfidence: 1,
      diagnosticInfo: {
        fields: {
          webhook_latency_ms: { numberValue: 221, kind: "numberValue" },
        },
      },
      languageCode: "en",
      sentimentAnalysisResult: null,
    },
    webhookStatus: {
      details: [],
      code: 0,
      message: "Webhook execution successful",
    },
    outputAudio: { type: "Buffer", data: [] },
    outputAudioConfig: null,
  };
  const simplifedResponse = client.simplifyResponse(rawResponse);
  const actual = client.generateComponents(simplifedResponse);
  const expected = {
    components: [
      {
        simpleResponse: {
          displayText: "Good day! What can I do for you today?",
        },
      },
      {
        simpleResponse: {
          textToSpeech: "Hey there, your random number is 0.3211999630329925",
        },
      },
    ],
    suggestions: [],
  };

  t.deepEqual(actual, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
