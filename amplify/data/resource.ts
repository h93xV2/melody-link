import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a
    .model({
      title: a.string(),
      description: a.string(),
      tags: a.string().array(),
      tracks: a.string().array()
    })
    .authorization((allow) => [allow.owner(), allow.guest().to(["read"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool"
  },
});