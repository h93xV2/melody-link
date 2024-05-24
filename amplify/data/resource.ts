import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a
    .model({
      title: a.string().required(),
      description: a.string(),
      tracks: a.string().array().required(),
      artist: a.string().required()
    })
    .authorization((allow) => [allow.owner(), allow.guest().to(["read"]), allow.authenticated().to(["read"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool"
  },
});