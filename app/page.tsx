"use client";

import React from "react";

import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";

import {Howl} from "howler";
import { Post, getPosts } from "@/utils/get-posts";

const trackNameToHowl: Map<string, Howl> = new Map();

const handleSongClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  const button = event.currentTarget;
  const name = button.dataset.name;
  const path = button.dataset.path;

  trackNameToHowl.forEach((value, key) => {
    value.pause();
  });

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
      if (button.innerText === "Play") {
        howl.play();
        button.innerText = "Pause";
      } else {
        button.innerText = "Play";
      }
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
      <ul style={{maxWidth:"800px",marginLeft:"auto",marginRight:"auto"}}>
        {
          posts.length === 0 && <h2 className="is-size-2 has-text-centered">No one's posted yet 😢</h2>
        }
        {
          posts.length > 0 && posts.map((post, postKey) => {
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
