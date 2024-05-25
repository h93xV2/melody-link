import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  data,
  storage
});

const { cfnUserPool } = backend.auth.resources.cfnResources;
// an empty array denotes "email" and "phone_number" cannot be used as a username
cfnUserPool.usernameAttributes = [];