import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'audioFiles',
  access: (allow) => ({
    'audio/private/{entity_id}/*': [
      allow.entity('identity').to(["read","write","delete"]),
    ],
    'audio/public/*': [
      allow.entity('identity').to(["read", "write", "delete"]),
      allow.authenticated.to(["read","write","delete"])
    ]
  })
});