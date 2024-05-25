import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { preSignUp } from './auth/pre-sign-up/resource.js';

const backend = defineBackend({
  auth,
  data,
  storage,
  preSignUp
});

const statement = new PolicyStatement({
  actions: [
    "cognito-idp:ListUsers"
  ],
  resources: [backend.auth.resources.userPool.userPoolArn]
})

backend.preSignUp.resources.lambda.addToRolePolicy(statement);