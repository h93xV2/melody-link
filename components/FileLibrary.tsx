"use client";

import { StorageManager } from "@aws-amplify/ui-react-storage";
import { RemoveWithPathOutput, list, remove } from "aws-amplify/storage";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type FileUpload = {
  lastUpdated?: Date,
  path: string
}

function FileLibrary() {
  const pathname = usePathname();

  const removeTrack = (name: string) => {
    remove({
      path: ({identityId}) => `audio/${identityId}/${name}`
    }).then((result: RemoveWithPathOutput) => {
      const fileNameToIndex: Map<string, number> =
        files.reduce((map, item) => map.set(item.path, files.indexOf(item)), new Map());
      const elementToRemove = fileNameToIndex.get(result.path);
      if (elementToRemove !== undefined && elementToRemove > -1) {
        files.splice(elementToRemove, 1);
        setFiles([...files]);
      }
    });
  };

  const [files, setFiles] = useState<FileUpload[]>([]);

  useEffect(() => {
    list({
      path: ({identityId}) => `audio/${identityId}/`
    }).then((result) => {
      if (result) {
        const filesToLoad = Array.from(result.items).map(item => {
          return {
            path: item.path,
            lastUpdated: item.lastModified
          };
        });
        setFiles([...filesToLoad]);
      }
    });
  }, [pathname]);

  return (
    <div className="container mt-5">
    <div className="box">
      <h1 className="title">Track Library</h1>
      <div className="content">
        <p>Upload and manage your tracks.</p>
      </div>
      <div className="box">
        <h2 className="subtitle">Your Tracks</h2>
        <ul>
          {files.map((file, index) => {
            const name = file.path.split("/")[2];
            return (
              <li className="columns" key={index}>
                <span className="column">{name}</span>
                <span className="column is-flex is-justify-content-end">
                  <button className="button is-danger" onClick={() => removeTrack(name)}>Delete</button>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="box">
        <h2 className="subtitle">Upload</h2>
        <StorageManager
          acceptedFileTypes={['audio/*']}
          path={({identityId}) => `audio/${identityId}/`}
          maxFileCount={3}
          isResumable
          onUploadSuccess={(event) => {
            if (event.key) {
              files.push({
                path: event.key
              });
              setFiles([...files]);
            }
          }}
          autoUpload={false}
          onUploadError={(error) => console.error('Error uploading file:', error)}
        />
      </div>
    </div>
  </div>
  );
}

export default FileLibrary