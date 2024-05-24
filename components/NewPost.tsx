"use client";

import { useState, useEffect, useRef, FormEvent, MutableRefObject } from 'react';

import { StorageManager } from "@aws-amplify/ui-react-storage";

import 'bulma/css/bulma.min.css';
import { usePathname } from 'next/navigation';
import { RemoveWithPathOutput, list, remove, copy } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource'

type File = {
  path: string
};

const createPost = async (userName: string, title: string, description: string, tags: string, files: File[]) => {
  const client = generateClient<Schema>();
  const trackNames = files.map(file => file.path.split("/")[3]);
  const tracks: string[] = [];
  
  for (let i = 0; i < trackNames.length; i ++) {
    const track = trackNames[i];

    const result = await copy({
      source: {
        path: ({identityId}) => `audio/private/${identityId}/${track}`
      },
      destination: {
        path: `audio/public/${track}`
      }
    });

    tracks.push(result.path);
  }

  client.models.Post.create({
    title,
    description,
    tags: tags.split(","),
    tracks,
    artist: userName
  });
};

const NewPost = (props: {userName: string}) => {
  const pathname = usePathname();

  const removeTrack = (name: string) => {
    remove({
      path: ({identityId}) => `audio/private/${identityId}/${name}`
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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const ref: MutableRefObject<any | null> = useRef(null);

  useEffect(() => {
    list({
      path: ({identityId}) => `audio/private/${identityId}/`
    }).then((result) => {
      if (result) {
        const filesToSet: File[] = Array.from(result.items).map(item => {
          return {path: item.path};
        });
        setFiles(filesToSet);
      }
    });
  }, [pathname]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !files.length) {
      alert('Title and at least one track are required!');
      return;
    }
    createPost(props.userName, title, description, tags, files).then(() => {
      ref.current.clearFiles();
      setTitle("");
      setDescription("");
      setTags("");
      setFiles([]);
      removeTracks(files);
      document.getElementById("success-modal")?.classList.add("is-active");
    });
  };

  const removeTracks = (filesToRemove: File[]) => {
    filesToRemove.forEach((file) => removeTrack(file.path.split("/")[3]));
  };

  return (
    <div className="container mt-5">
      <div className="modal" id="success-modal">
        <div className="modal-background"></div>
        <div className="modal-content">
        <div className="notification is-primary">
          <button
            className="delete"
            onClick={() => document.getElementById("success-modal")?.classList.remove("is-active")}
          />
          Congrats! Your post has been published successfully.
        </div>
        </div>
        <button className="modal-close is-large" aria-label="close"></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="columns">
          <div className="column is-half">
            <h1 className="title">Create New Post</h1>
            <div className="field">
              <label className="label">Title*</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Enter the title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Enter a description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Tags</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Enter tags separated by commas"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-link">
                  Submit
                </button>
              </div>
              <div className="control">
                <button
                  type="reset"
                  className="button is-link is-light"
                  onClick={() => {
                    removeTracks(files);
                    ref.current.clearFiles()
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label className="label">Tracks* (x{files.length})</label>
              <div className="control">
                {files.map((file, index) => {
                  const name = file.path.split("/")[3];
                  return (
                    <div className="columns" key={index}>
                      <span className="column">{name}</span>
                      <span className="column is-flex is-justify-content-end">
                        <button type="button" className="button is-danger" onClick={() => removeTrack(name)}>
                          Delete
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="field">
              <label className="label">Upload</label>
              <StorageManager
                acceptedFileTypes={['audio/*']}
                path={({identityId}) => `audio/private/${identityId}/`}
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
                onUploadError={(error) => console.error('Error uploading file:', error)}
                ref={ref}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPost;
