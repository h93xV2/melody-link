import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  data,
  storage
});

const { cfnUserPool } = backend.auth.resources.cfnResources

cfnUserPool.usernameAttributes = [];
cfnUserPool.aliasAttributes = ["preferred_username"];