import { struct, JsonObject } from "pb-util";
import get = require("lodash.get");
import has = require("lodash.has");
const _ = { get, has };

// TODO: Make this configurable or use fetch
import axios from "axios";

export interface DFCheatRequestConfig {
  transformgrpc?: boolean;
  languageCode?: dflanguages;
  session?: string;
  backend?: string;
  debug?: boolean;
  otherplatforms?: string[];
}

export interface DFSimplePayload {
  fulfillmentMessages: any[] | undefined;
  fulfillmentText?: string;
  queryText?: string;
  webhookPayload?: any[];
}
export type RequestKinds = "text" | "event";
export interface DFCheatRequestInput {
  kind: RequestKinds; // text | event
  content: any; // ex. text, event payload w/ JSON parameters, etc
  requestData?: any; // Data that goes up with the REQUEST. Available as const myData = conv.getRequestData()
  flags?: DFCheatRequestConfig;
}

const requestTemplate = `{
	"session": "1234567890987",
	"queryInput": {
		"text": {
			"text": "yes",
			"languageCode": "en-us"
		}
	},
	"queryParams": {
		"payload": {}
	}
}`;
/**
 * RequestCheat: Various helpers to make working with
 * requests (and responses) much easier in order to build
 * rich frontends
 *
 *
 *
 *
 */
export class RequestCheat {
  private axiosInst: any;
  public languageCode: string;
  public session: string;
  public _session: string;
  public transformgrpc: boolean;
  public debug: boolean;
  public otherplatforms: string[];

  constructor(public config: DFCheatRequestConfig) {
    const defaults = {
      transformgrpc: false,
      languageCode: "en_US",
      debug: false,
      otherplatforms: [],
    };
    this.axiosInst = axios.create({
      baseURL: this.config.backend,
    });
    // Aggressive cold start fix
    this.axiosInst.defaults.timeout = 200000;
    this.languageCode = this.config.languageCode
      ? this.config.languageCode
      : defaults.languageCode;
    this.session = this.config.session
      ? this.config.session
      : RequestCheat.buildSessionId();
    this._session = this.session;
    this.transformgrpc = this.config.transformgrpc
      ? this.config.transformgrpc
      : defaults.transformgrpc;
    this.debug = this.config.debug === true ? true : defaults.debug;
    this.otherplatforms =
      this.config.otherplatforms && this.config.otherplatforms.length
        ? this.config.otherplatforms
        : defaults.otherplatforms;
    this.__debug(
      `RequestCheat initialized with config: ${JSON.stringify(this.config)}`
    );
  }

  /**
   * Alias to log, will not fire if debug is set to false
   * @param data
   */
  public __debug(...data: any) {
    if (this.debug) {
      console.log.apply(console, data);
    }
  }

  /**
   *
   * Update config DFCheatRequestConfig
   *  transformgrpc?: boolean; // Defaults TRUE
   *  languageCode?: dflanguages;
   *  session?: string;
   *  backend?: string;
   *
   */
  // public updateConfig(options: DFCheatRequestConfig) {
  //   if (options) {
  //     for (let opt in options) {
  //       const val = options[opt];
  //       this.config[opt] = val;
  //     }
  //   }
  // }

  /**
   * Returns current requestCheat config
   *
   */
  public getConfig(): DFCheatRequestConfig {
    return this.config;
  }

  /**
   * Update backend used in requests
   * @param backend: http://localhost:8000/chat
   *
   */
  public updateLanguageCode(languageCode: string) {
    if (languageCode) {
      this.config.languageCode = languageCode;
      this.languageCode = languageCode;

      this.__debug(`RequestCheat languageCode set to: ${this.config.backend}`);
    }
  }
  /**
   * Update backend used in requests
   * @param backend: http://localhost:8000/chat
   *
   */
  public updateBackend(backend: string) {
    if (backend) {
      this.config.backend = backend;
      this.axiosInst = axios.create({
        baseURL: this.config.backend,
      });
      this.__debug(`RequestCheat backend set to: ${this.config.backend}`);
    }
  }

  /**
   * Update whether requests should transform
   * @param backend: http://localhost:8000/chat
   *
   */
  public updateTransformgrpc(transformgrpc: boolean) {
    this.config.transformgrpc = transformgrpc;
    this.transformgrpc = transformgrpc;
    this.__debug(
      `RequestCheat transformgrpc set to: ${this.config.transformgrpc}`
    );
  }

  /**
   * Update whether requests should transform
   * @param backend: http://localhost:8000/chat
   *
   */
  public updateSession(session: string) {
    this.config.session = session;
    this.session = session;
    this._session = this.session;
    this.__debug(`RequestCheat session set to: ${this.config.session}`);
  }

  /**
   * @param input: Data to transform if necessary
   * @param flags: override any "global" config (like transformgrpc), see DFCheatRequestConfig
   *
   */
  _safeParse(input: any, flags: DFCheatRequestConfig = {}) {
    let result = input;
    let transform = this.transformgrpc;
    if (flags.transformgrpc !== undefined) {
      transform = flags.transformgrpc;
    }
    if (transform) {
      result = this._json2proto(input);
      this.__debug(`Transformed JSON <> Proto`, input, result);
    }
    return result;
  }

  /**
   * Alias for creating a request object for text
   * @param text: http://localhost:8000/chat
   * @param requestData: {a:1,b:2,c:3}
   *
   * Whether grpc gets transformed & other items depends on global config
   *
   */
  public text(text: string, requestData: any) {
    const payload = {
      kind: "text" as RequestKinds,
      content: text,
      requestData,
    };
    return this.buildRequest(payload);
  }

  /**
   * Send text
   * @param text: "hello world"
   * @param? requestData: {a:1,b:2,c:3}
   * @flags? DFCheatRequestConfig: {session:"1234567", requestData: {a:1,b:2}}
   *
   */
  public sendText(
    text: string,
    requestData?: any,
    flags?: DFCheatRequestConfig
  ) {
    const payload = {
      kind: "text" as RequestKinds,
      content: text,
      requestData,
      flags,
    };
    const textPayload = this.buildRequest(payload);
    return this.send(textPayload);
  }

  /**
   * Alias for creating a request object for an event
   * @param eventName: 'welcome'
   * @param requestData: {a:1,b:2,c:3}
   *
   * Whether grpc gets transformed & other items depends on global config
   *
   */
  public event(name: string, parameters: any = {}, requestData: any) {
    const payload = {
      kind: "event" as RequestKinds,
      content: {
        name,
        parameters,
      },
      requestData,
    };
    return this.buildRequest(payload);
  }

  /**
   * Alias for creating a request object for an event
   * @param eventName: 'welcome'
   * @param parameters: {a:1,b:2,c:3}
   * @param requestData: {a:1,b:2,c:3}
   * Whether grpc gets transformed & other items depends on global config
   *
   */
  public sendEvent(
    name: string,
    parameters: any = {},
    requestData: any,
    flags: any
  ) {
    const payload = {
      kind: "event" as RequestKinds,
      content: {
        name,
        parameters,
      },
      requestData,
      flags,
    };
    const event = this.buildRequest(payload);
    return this.send(event);
  }

  /**
   * Returns a request payload that can be then be sent to DialogFlow's system
   * See here for details: https://cloud.google.com/dialogflow/docs/reference/rest/v2/projects.agent.sessions/detectIntent#request-body
   * See here for examples:
   *
   */
  public buildRequest(config: DFCheatRequestInput | string) {
    if (typeof config === "string") {
      const payload = {
        kind: "text",
        content: config,
        flags: {
          transformgrpc: this.transformgrpc,
        },
      };
      config = payload as DFCheatRequestInput;
    }

    if (!config.kind) {
      throw new Error("<buildRequest> Missing essential parameter 'kind'");
    }

    const base = JSON.parse(requestTemplate);
    if (config.flags && config.flags.session) {
      base.session = config.flags.session;
      this.session = config.flags.session;
    } else {
      base.session = this.session ? this.session : this.buildSession();
    }

    this.__debug(`Session attached to request`, base.session);

    if (config.kind === "event") {
      const {
        name,
        parameters = {},
        languageCode = this.languageCode,
      } = config.content;

      delete base.queryInput.text;
      base.queryInput.event = {};
      base.queryInput.event.name = name;
      base.queryInput.event.parameters = this._safeParse(
        parameters,
        config.flags
      );
      base.queryInput.event.languageCode = languageCode;
    } else if (config.kind === "text") {
      base.queryInput.text.text = config.content;
      base.queryInput.text.languageCode = this.languageCode;
    }

    if (config.requestData && Object.keys(config.requestData).length) {
      base.queryParams.payload = this._safeParse(
        config.requestData,
        config.flags
      );
    } else {
      delete base.queryParams;
    }
    return base;
  }

  /**
   * Generates random session id (sta)
   *
   * @static
   */
  static buildSessionId(): string {
    return `${new Date().getTime()}-${String(Math.random()).slice(2)}`;
  }

  /**
   * ## BuildSession
   * Return fully qualified session string
   * ```ts
   * RequestCheat.buildSession(123456, 'bingo-project') // projects/bingo-project/agent/sessions/123456
   *```
   *
   * @param session: string, ex. 1234567890
   * @param project_id: string ex. bingo-project
   */
  static buildSession(session: string | number, project_id: string): string {
    return `projects/${project_id}/agent/sessions/${session}`;
  }

  /**
   * @static
   * Transform Protstruct to JSON
   * doc: https://github.com/valgaze/grpc_101.md
   * Useful for webhookPayload & other items returned from backend
   * @param payload
   */
  static __proto2json(payload: any) {
    return struct.decode(payload);
  }

  /**
   * Transform Protstruct to JSON
   * doc: https://github.com/valgaze/grpc_101.md
   * Useful for webhookPayload & other items returned from backend
   * @param payload
   */
  static __json2proto(payload: JsonObject | any) {
    return struct.encode(payload);
  }

  /**
   * Generates a random session id (not a session path)
   */
  public buildSession() {
    return RequestCheat.buildSessionId();
  }

  /**
   * Transform Protstruct to JSON
   * doc: https://github.com/valgaze/grpc_101.md
   * Useful for webhookPayload & other items returned from backend
   * @param payload
   */
  public _proto2json(payload: any) {
    return struct.decode(payload);
  }
  /**
   * Transform JSON to Protostruct
   * doc: https://github.com/valgaze/grpc_101.md
   * Useful for event parameters, request data
   * @param payload
   */
  public _json2proto(payload: JsonObject | any) {
    return struct.encode(payload);
  }

  /**
   * Alias for lodash.has
   * @param input
   * @param path
   */
  public _has(input: object, path: string) {
    return _.has(input, path);
  }

  /**
   * Alias for lodaash.get
   * @param input
   * @param path
   * @param fallback
   */
  public _get(input: object, path: string, fallback: any = null) {
    return _.get(input, path, fallback);
  }

  /**
   * generateComponents
   * Produces a de-duped & easy to work with list of components from fulfillmentMessages, dialogflow-fulfillent, actions-on-google, etc
   * @param response: DFSimplePayload (run simplifyResponse)
   *  - Combine webhookPayload, fulfillmentMessages
   *  - For text, filter out blanks & duplicates, every text variant turns into simpleResponse
   *
   * ```
   * import {RequestCheat} from 'df-cheatcodes-base'
   *
   * async function main() {
   *   const session = RequestCheat.buildSessionId();
   *   const languageCode = "en_US"; // (optonal), defauls to 'en_US'
   *   const transformgrpc = true; // (optional)
   *   const backend = `http://localhost:8000/chat`
   *   const config = {
   *     session,
   *     languageCode,
   *     transformgrpc,
   *     backend,
   *     debug: true,
   *   };
   *   const client = new RequestCheat(config);
   *   const chatRes = await client.send(`Hi!!!`)
   *   // Strip everything except components & transform since gRPC is true
   *   const tidyResult = client.simplifyResponse(chatRes.data);
   *   // Generate components
   *   const componentRoster = client.generateComponents(tidyResult); // {suggestions, components}
   *   const { components, suggestions } = componentRoster
   *   // suggestions are all suggestions
   *   // components are all components filtered appropriately
   * }
   * main()
   * ```
   *
   *
   */
  generateComponents(response: DFSimplePayload) {
    // Ouputs a list of components & a list of suggestions

    const audio = []; // for future use, ssml
    const genSimpleResponse = (text: string) => {
      return {
        simpleResponse: {
          displayText: text,
        },
      };
    };
    let components = [];
    let suggestions: any[] = [];
    // 1) See if any simple text on response (remove duplicates from fulfillmentMessages)
    let simpleText = _.get(response, "fulfillmentText", null);
    simpleText = simpleText && simpleText === " " ? null : simpleText;
    if (simpleText) components.push(genSimpleResponse(simpleText));

    // 2) Get AOG Components
    const aog = _.get(response, "webhookPayload.google", {});

    // AOG Suggestions
    suggestions = _.get(aog, "richResponse.suggestions", []);

    const linkOutSuggestion = _.get(aog, "richResponse.linkOutSuggestion", {});

    // 3) AoG "user pickers" like listSelect & carouselSelect
    // https://actions-on-google.github.io/actions-on-google-nodejs/classes/conversation_helper.list.html
    let userSelect = null; // Should only be one, will update this value if any other pickers

    // listSelect
    const listSelect = _.get(aog, "systemIntent.data.listSelect", null);
    if (listSelect) {
      userSelect = { listSelect };
    } else {
      // carouselSelect
      const carouselSelect = _.get(aog, "systemIntent.data.carouselSelect");
      if (carouselSelect) {
        userSelect = { carouselSelect };
      }
    }

    // 4) Remove blanks ('' & ' ') & duplicates with simpleText (fulfillmentText) above
    let aog_richcomponents = _.get(aog, "richResponse.items", []);
    aog_richcomponents = aog_richcomponents.filter(
      (component: any, i: number) => {
        // Unpack simple responses, alias all to displayText for ease of use
        if (_.has(component, "simpleResponse")) {
          let text = _.get(component, "simpleResponse.textToSpeech", null);
          if (!text) {
            text = _.get(component, "simpleResponse.displayText", null);
          }
          if (text && text != " " && text !== simpleText) {
            return true;
          } else {
            // Get rid of blanks, dupes, & other punk
            return false;
          }
        } else {
          return true;
        }
      }
    );

    // 5) Add AoG components to component roster
    components.push(...aog_richcomponents);

    // 6) fulfillmentMessages (usually stuff from DialogFlow web console)
    /**
     * fulfillmentMessages has some of the following variants (blank or space)
     *     {
     *        "platform": "PLATFORM_UNSPECIFIED",
     *        "text": {
     *            "text": [
     *                ""
     *            ]
     *        },
     *        "message": "text"
     *      }]
     *    }
     *
     *  // Sketchy: simpleResponses [w/ an S]
     *  {
     *    fulfillmentMessages: [{
     *    "platform": "ACTIONS_ON_GOOGLE",
     *    "simpleResponses": {
     *      "simpleResponses": [
     *        {
     *          "textToSpeech": "",
     *          "ssml": "",
     *          "displayText": ""
     *        }
     *      ]
     *    },
     *    "message": "simpleResponses"
     *  }
     *  1. Get rid of duplicates w/ fulfillmentText
     *  2. Get rid of empty & ' ' text nodes
     *  3. Normalize text vs simpleResponses.simpleResponses.displayText/textToSpeech
     *  4. Get rid of unsupported platforms (can configure w/ otherplatforms config)
     *  5. Get rid of "Payloads" (we should think about this): https://dialogflow.com/docs/reference/message-objects#custom_payload_message_object
     *
     *
     */

    let dialogflow_fulfillmentMessages = _.get(
      response,
      "fulfillmentMessages",
      []
    );
    const _unusedPayloads = [];

    let safePlatforms = ["ACTIONS_ON_GOOGLE", "PLATFORM_UNSPECIFIED"];
    if (this.otherplatforms && this.otherplatforms.length) {
      safePlatforms = safePlatforms.concat(this.otherplatforms);
    }
    const validText = (input: string) => {
      // Strip out dupes, irrelevant data
      if (!input || input === " ") {
        return false;
      }
      // closurized fulfillmentText
      if (simpleText && input === simpleText) {
        return false;
      }
      return true;
    };

    dialogflow_fulfillmentMessages = dialogflow_fulfillmentMessages.filter(
      (res: any): any => {
        // TODO: Boil all this into a simple schema for filtering
        // ie you can knock out several items if duped w/ fulfillmentText
        const { message, platform } = res;
        // Payload
        if (message === "payload") {
          _unusedPayloads.push(res);
          return false;
        }
        // Non-target platforms
        if (!safePlatforms.includes(platform)) {
          return false;
        }
        // Case1: empty response
        if (message === "text") {
          const case1 = _.get(res, "text.text", [])[0];
          if (validText(case1)) {
            return true;
          } else {
            return false;
          }
        }
        if (message === "suggestions") {
          const { suggestions: df_suggestions } = res.suggestions;
          suggestions = suggestions.concat(...df_suggestions);
          // Not in component list
          return false;
        }
        // Case2: simpleResponses.simpleResponses[0]
        // Careful: "simpleResponses" not "simpleResponse"
        if (message === "simpleResponses") {
          // case2: empty simpleResponse, or dupe of fulfillmentText
          /*
        {
          fulfillmentMessages: [{
          "platform": "ACTIONS_ON_GOOGLE",
          "simpleResponses": {
            "simpleResponses": [
              {
                "textToSpeech": "This is bongo!",
                "ssml": "",
                "displayText": ""
              }
            ]
          },
          "message": "simpleResponses"
        }
        */
          const case2 = _.get(res, "simpleResponses.simpleResponses", []);
          const entry = case2[0];
          const { displayText, textToSpeech, ssml } = entry;
          let result = false;
          if (validText(displayText)) {
            result = true;
          } else if (validText(textToSpeech)) {
            // stash onto displayText
            entry.displayText = textToSpeech;
            result = true;
          }
          if (validText(ssml)) {
            audio.push(ssml);
          }
          return result;
        }
        // carouselSelect & listSelect
        // There should only be one in a response
        if (message === "carouselSelect") {
          // No validation
          userSelect = res;
          return false;
        }
        if (message === "listSelect") {
          // No validation
          userSelect = res;
          return false;
        }
      }
    );
    // Normalize "text" to simpleResponse
    dialogflow_fulfillmentMessages.forEach(
      (fulfillmentObj: any, idx: number, arr: any[]) => {
        const { message } = fulfillmentObj;
        if (message === "simpleResponses") {
          var simpleRes = _.get(
            fulfillmentObj,
            "simpleResponses.simpleResponses",
            []
          )[0];
          var text = _.get(
            simpleRes,
            "textToSpeech",
            _.get(fulfillmentObj, "displayText", null)
          );
          dialogflow_fulfillmentMessages[idx] = genSimpleResponse(text);
        }
        if (message === "text") {
          const text = _.get(fulfillmentObj, "text.text", [])[0];
          dialogflow_fulfillmentMessages[idx] = genSimpleResponse(text);
        }
      }
    );
    // Add normalized/filtered fulfillmentMessages to roster
    components.push(...dialogflow_fulfillmentMessages);
    // Carousel/Lists
    // This could be its own separate or put in stream of "regular" responses
    if (userSelect) {
      components.push(userSelect);
    }
    // fulfillmentMessages 💕 webhookPayload
    const finalPayload = {
      components,
      suggestions,
      linkOutSuggestion,
    };
    return finalPayload;
  }

  /**
   *
   * @param res DialogFlow response
   *
   * tl:dr: Will take a DF response & return these items
   *   fulfillmentMessages: any[] | undefined; // GoogleCloudDialogflowV2IntentMessage, DialogFlow web console
   *   fulfillmentText?: string; // simple response text
   *   queryText?: string; // what user said if any
   *   webhookPayload?: any[]; // AoG rich components (+ some tricks)
   *
   */
  public simplifyResponse(res: any): DFSimplePayload {
    let finalRes = res;
    if (res.length > 0) {
      finalRes = res[0];
    }
    if (res.queryResult) {
      finalRes = res.queryResult;
    }

    // Grab user text, fulfillmentText, fulfillmentMessages, webhookPayload
    const {
      queryText,
      webhookPayload,
      fulfillmentMessages,
      fulfillmentText = null,
    } = finalRes;

    let tidy_webhookPayload = webhookPayload;
    if (tidy_webhookPayload && this.transformgrpc) {
      tidy_webhookPayload = this._proto2json(tidy_webhookPayload);
      this.__debug(
        `Transformed webhookPayload: ${JSON.stringify(tidy_webhookPayload)}`
      );
    }

    const payload = {
      queryText,
      fulfillmentText,
      webhookPayload: tidy_webhookPayload,
      fulfillmentMessages,
    };
    return payload;
  }

  async send(param: string | any) {
    let payload = param;
    if (typeof param === "string") {
      payload = this.buildRequest({
        kind: "text",
        content: param,
      });
    }
    const configuration = {
      method: "POST",
      data: payload,
    };
    this.__debug("<Sending...>", configuration);
    const reply = await this.axiosInst(configuration).catch((e: any) => {
      console.log(`<RequestCheat.send>Catastrophic Error: ${e}`, e);
      throw new Error(
        `<From df-cheatcodes-base: RequestCheat.send> There may be an issue with your backend address: ${this.config.backend}`
      );
    });
    if (this.session !== this._session) {
      this.session = this._session;
    }
    return reply || {};
  }
}

// Source: https://cloud.google.com/dialogflow/docs/reference/language
export type dflanguages =
  | "zh-HK"
  | "zh-CN"
  | "zh-TW"
  | "da"
  | "nl"
  | "en"
  | "en-AU"
  | "en-CA"
  | "en-GB"
  | "en-IN"
  | "en-US"
  | "fr"
  | "fr-CA"
  | "fr-FR"
  | "de"
  | "hi"
  | "id"
  | "it"
  | "ja"
  | "ko"
  | "no"
  | "pl"
  | "pt-BR"
  | "pt"
  | "ru"
  | "es"
  | "es-419"
  | "es-ES"
  | "sv"
  | "th"
  | "tr"
  | "uk"
  | "en_US"
  | "en_us"
  | string;
