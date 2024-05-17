import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'audioFiles',
  access: (allow) => ({
    'audio/*': [
      allow.guest.to(["read"]),
      allow.entity('identity').to(["read","write","delete"])
    ]
  })
});