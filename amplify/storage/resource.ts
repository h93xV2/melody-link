import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'audioFiles',
  access: (allow) => ({
    'audio/{entity_id}/*': [
      allow.guest.to(["read"]),
      allow.entity('identity').to(["read","write","delete"])
    ]
  })
});