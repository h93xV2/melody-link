"use server";

import { list } from "aws-amplify/storage";

export default async function Files() {
  const files = await list({
    path: ({identityId}) => `audio/${identityId}/`
  });

  return (
    <ul>
      {Array.from(files.items).map((file, index) => <li key={index}>{file.path}</li>)}
    </ul>
  );
}