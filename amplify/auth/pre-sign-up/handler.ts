import type { PreSignUpTriggerHandler } from "aws-lambda"
import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

export const handler: PreSignUpTriggerHandler = async (event) => {
  const userPoolId = event.userPoolId;
  const birthdate = new Date(event.request.userAttributes["preferred_username"]);

  const client = new CognitoIdentityProviderClient();
  const input = { // ListUsersRequest
    UserPoolId: userPoolId, // required
    AttributesToGet: [ // SearchedAttributeNamesListType
      "preferred_username",
    ],
  };
  const command = new ListUsersCommand(input);
  const response = await client.send(command);

  console.log(response);

  return event
}