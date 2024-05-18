import { cookies } from "next/headers";

import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth/server";

import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { list } from "aws-amplify/storage/server";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export const cookiesClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function getCurrentAuthUser() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => {
        return {
          user: await getCurrentUser(contextSpec),
          userAttributes: await fetchUserAttributes(contextSpec)
        }
      },
    });
    return currentUser;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUserFiles() {
  try {
    const files = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => await list(contextSpec, { path: ({identityId}) => `audio/${identityId}/` })
    });

    return files;
  } catch (error) {
    console.error(error);
  }
}