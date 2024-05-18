"use client";

import { StorageManager } from "@aws-amplify/ui-react-storage";

function FileUpload(props: {files: string[]}) {
  return (
    <>
      <StorageManager
        acceptedFileTypes={['audio/*']}
        path={({identityId}) => `audio/${identityId}/`}
        maxFileCount={1}
        isResumable
        onUploadSuccess={console.log}
      />
      <ul>
        {
          props.files && props.files.map((item, index) => <li key={index}>{item}</li>)
        }
      </ul>
    </>
  );
}

export default FileUpload