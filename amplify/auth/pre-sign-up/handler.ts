import type { PreSignUpTriggerHandler } from "aws-lambda"
import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

export const handler: PreSignUpTriggerHandler = async (event) => {
  const userPoolId = event.userPoolId;
  const preferredUsername = event.request.userAttributes["preferred_username"];

  const client = new CognitoIdentityProviderClient({region: event.region});
  const input = {
    UserPoolId: userPoolId,
    AttributesToGet: [
      "preferred_username",
    ],
  };
  const command = new ListUsersCommand(input);
  const response = await client.send(command);

  response.Users?.forEach(user => {
    user.Attributes?.forEach(attribute => {
      if (attribute.Name === "preferred_username" && attribute.Value === preferredUsername) {
        throw new Error("username is taken");
      }
    });
  });

  return event
}