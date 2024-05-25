"use client";

import React from "react";

import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";

import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";

import {Howl, Howler} from "howler";

type Track = {
  name: string,
  path: string
};

type Post = {
  title: string,
  description?: string,
  tracks: Track[],
  artist: string,
  createdAt: string
};

const getPosts = async (authMode: any): Promise<Post[]> => {
  const client = generateClient<Schema>();
  const {data, errors} = (await client.models.Post.list({authMode}));
  const posts: Post[] = [];

  if (errors) {
    console.error("Unable to list posts: %o", errors);
  }

  for (let i = 0; i < data.length; i ++) {
    const result = data[i];
    if (result.title && result.artist) {
      const tracks: Track[] = [];

      for (let j = 0; j < result.tracks.length; j ++) {
        const track = result.tracks[j];

        if (track) {
          tracks.push({
            name: track.split("/")[2],
            path: track
          })
        }
      };

      posts.push({
        title: result.title,
        description: result.description ? result.description : undefined,
        tracks,
        artist: result.artist,
        createdAt: result.createdAt
      });
    }
  }

  return posts;
};

const trackNameToHowl: Map<string, Howl> = new Map();

const handleSongClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  const name = event.currentTarget.dataset.name;
  const path = event.currentTarget.dataset.path;

  if (name && path) {
    if (!trackNameToHowl.has(name)) {
      const url = await getUrl({path});

      trackNameToHowl.set(name, new Howl({
        src: url.url.href,
        onload: (soundId) => console.log("Track loaded")
      }));
    }

    const howl = trackNameToHowl.get(name);

    if (howl) {
      Howler.stop();

      howl.play();
    }
  }
};

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let authMode: any;

    getCurrentUser().then((result) => {
      authMode = "userPool";
    }).catch((reason) => {
      authMode = "identityPool";
    }).finally(() => {
      getPosts(authMode).then((results) => setPosts([...results])).catch((reason) => {
        console.error("Unable to fetch posts %o", reason);
      });
    });
  }, []);

  return (
    <main>
      <h1 className="title is-size-1">MelodyLink</h1>
      <ul style={{maxWidth:"800px",marginLeft:"auto",marginRight:"auto"}}>
        {
          posts.map((post, postKey) => {
            return (<li key={postKey} className="mb-3">
              <div className="card">
                <div className="card-content">
                  <h2 className="is-size-2">{post.artist} - {post.title}</h2>
                  <p>Uploaded <i>{new Date(post.createdAt).toDateString()}</i></p>
                  <p>{post.description}</p>
                  <hr />
                  <ul>
                    {
                      post.tracks.map((track, trackKey) => {
                        return (<li key={trackKey}>
                          <button
                            className="button is-small mr-2"
                            onClick={handleSongClick}
                            data-name={track.name}
                            data-path={track.path}
                          >
                            Play
                          </button>
                          {track.name}
                        </li>);
                      })
                    }
                  </ul>
                </div>
              </div>
            </li>);
          })
        }
      </ul>
    </main>
  );
}
