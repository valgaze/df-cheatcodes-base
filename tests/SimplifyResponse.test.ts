import * as test from "tape";
import { RequestCheat } from "../src";

let client: any;
let session: string;
let languageCode: string;
let debug = true;
test("setup", function (t) {
  session = RequestCheat.buildSessionId();
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

test("<Sanity test>", async (t: any) => {
  const res = Math.random();
  const clean = Boolean(res);
  const expected = true;

  t.deepEqual(clean, expected);
});

test("<config>", async (t: any) => {
  const expected = {
    session,
    languageCode,
    transformgrpc: true,
    backend: `http://www.bongo.com`,
    debug,
  };
  client.updateTransformgrpc(true);
  client.updateBackend(`http://www.bongo.com`);
  const actual = client.getConfig();

  console.log(">>", actual);
  console.log(">>", expected);

  t.deepEqual(actual, expected);
  client.updateTransformgrpc(false);
  client.updateBackend("http://localhost:8000/chat");
});

test("<simplifyResponse (no transform)>", async (t: any) => {
  const sample = {
    responseId: "bfd8277a-00c8-4cd4-bd2a-a6640c5b0e62-e15c53b8",
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
            "projects/bongoagent-qmguth/agent/sessions/1589755477499-7032793875090868/contexts/_actions_on_google",
          lifespanCount: 99,
          parameters: {
            fields: { data: { stringValue: "{}", kind: "stringValue" } },
          },
        },
        {
          name:
            "projects/bongoagent-qmguth/agent/sessions/1589755477499-7032793875090868/contexts/__system_counters__",
          lifespanCount: 1,
          parameters: {
            fields: {
              "no-input": { numberValue: 0, kind: "numberValue" },
              "no-match": { numberValue: 0, kind: "numberValue" },
            },
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
                                            "Backend server is working at Sun May 17 2020 15:44:50 GMT-0700 (Pacific Daylight Time)",
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
          webhook_latency_ms: { numberValue: 355, kind: "numberValue" },
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

  const actual = client.simplifyResponse(sample);
  const expected = {
    queryText: "health",
    fulfillmentText: "",
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
                                          "Backend server is working at Sun May 17 2020 15:44:50 GMT-0700 (Pacific Daylight Time)",
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
                                      subtitle: {
                                        stringValue: "The Backend is up!",
                                        kind: "stringValue",
                                      },
                                      formattedText: {
                                        stringValue: "Successful Health Check!",
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
              userStorage: { stringValue: '{"data":{}}', kind: "stringValue" },
              expectUserResponse: { boolValue: true, kind: "boolValue" },
            },
          },
          kind: "structValue",
        },
      },
    },
    fulfillmentMessages: [
      {
        platform: "PLATFORM_UNSPECIFIED",
        text: { text: [""] },
        message: "text",
      },
    ],
  };

  t.deepEqual(actual, expected);
});

test("<simplifyResponse (transform grpc)>", async (t: any) => {
  // activate transform
  client.updateTransformgrpc(true);
  const sample = {
    responseId: "1e5002c2-be2d-4f1d-8429-41f173109441-e15c53b8",
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
            "projects/bongoagent-qmguth/agent/sessions/1589756297748-7976738893937398/contexts/_actions_on_google",
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
                                            "Backend server is working at Sun May 17 2020 15:58:20 GMT-0700 (Pacific Daylight Time)",
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
          webhook_latency_ms: { numberValue: 517, kind: "numberValue" },
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
  const actual = client.simplifyResponse(sample);
  const expected = {
    queryText: "health",
    fulfillmentText: "",
    webhookPayload: {
      google: {
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech:
                  "Backend server is working at Sun May 17 2020 15:58:20 GMT-0700 (Pacific Daylight Time)",
              },
            },
            {
              basicCard: {
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
                title: "Backend Server Working",
                image: {
                  url:
                    "https://cdn.sallysbakingaddiction.com/wp-content/uploads/2019/05/6-chocolate-chip-cookies.jpg",
                  accessibilityText: "Mmm...",
                },
              },
            },
          ],
        },
        userStorage: '{"data":{}}',
        expectUserResponse: true,
      },
    },
    fulfillmentMessages: [
      {
        platform: "PLATFORM_UNSPECIFIED",
        text: { text: [""] },
        message: "text",
      },
    ],
  };
  t.deepEqual(actual, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
