import { getServerEnv } from "../schema";
import jwt from "jsonwebtoken";
import { VapiClient } from "@vapi-ai/server-sdk";

type TPayload = {
  orgId: string;
  token: {
    tag: string;
  };
};

// Get server environment variables
const serverEnv = getServerEnv();

const payload: TPayload = {
  orgId: serverEnv.VAPI_ORG_ID,
  token: {
    // this is the scope of the token
    tag: "private",
  },
};

// Vapi private key
const key = serverEnv.VAPI_PRIVATE_KEY;

const options = {
  expiresIn: 1800,
};

const token = jwt.sign(payload, key, options);

export const vapiServer = new VapiClient({ token });
