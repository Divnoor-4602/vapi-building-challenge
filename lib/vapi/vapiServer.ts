import { env } from "../schema";
import jwt from "jsonwebtoken";
import { VapiClient } from "@vapi-ai/server-sdk";

type TPayload = {
  orgId: string;
  token: {
    tag: string;
  };
};

const payload: TPayload = {
  orgId: env.VAPI_ORG_ID,
  token: {
    // this is the scope of the token
    tag: "private",
  },
};

// Vapi private key
const key = env.VAPI_PRIVATE_KEY;

const options = {
  expiresIn: 1800,
};

const token = jwt.sign(payload, key, options);

export const vapiServer = new VapiClient({ token });
