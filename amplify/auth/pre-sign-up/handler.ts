import type { PreSignUpTriggerHandler } from "aws-lambda"

export const handler: PreSignUpTriggerHandler = async (event) => {
  console.log(event.request.userAttributes);

  return event
}