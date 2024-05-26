"use client";

import {Howl} from "howler";
import { Post } from "@/utils/get-posts";
import { getUrl, remove } from "aws-amplify/storage";
import React from "react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";

const trackNameToHowl: Map<string, Howl> = new Map();

const handlePostDelete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  const button = event.currentTarget;
  const id = button.dataset.postid;

  const client = generateClient<Schema>();

  if (id) {
    client.models.Post.get({id}).then(result => {
      result.data?.tracks.forEach(track => {
        if (track) {
          remove({
            path: track
          });
        }
      });

      client.models.Post.delete({
        id
      }).then(result => {
        document.getElementById(id)?.remove();

        if (document.getElementsByClassName('post-card').length === 0) {
          window.location.reload();
        }
      });
    });
  }
};

const handleSongClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  const button = event.currentTarget;
  const name = button.dataset.name;
  const path = button.dataset.path;
  const initialText = button.innerText;

  button.innerText = "...";

  trackNameToHowl.forEach((value, key) => {
    value.pause();
  });

  if (name && path) {
    if (!trackNameToHowl.has(name)) {
      const url = await getUrl({path});

      trackNameToHowl.set(name, new Howl({
        src: url.url.href,
        onload: (soundId) => console.log("Track loaded"),
        onend: () => button.textContent = "Play",
        onplay: () => button.innerText = "Pause",
        onpause: () => button.innerText = "Play",
      }));
    }

    const howl = trackNameToHowl.get(name);

    if (howl) {
      if (initialText === "Play") {
        howl.play();
      }
    }
  }
};

function PostList(props: {posts?: Post[], isDeleteVisible?: boolean}) {
  const posts = props.posts;

  return (
    <ul className="pt-3" style={{maxWidth:"800px",marginLeft:"auto",marginRight:"auto"}}>
      {
        posts === undefined && <h2 className="is-size-2 has-text-centered">Loading posts ...</h2>
      }
      {
        posts && posts.length === 0 && <h2 className="is-size-2 has-text-centered">No posts yet 😢</h2>
      }
      {
        posts && posts.length > 0 && posts.map((post, postKey) => {
          return (<li key={postKey} className="mb-3">
            <div className="card post-card" id={post.id}>
              <div className="card-content">
                <h2 className="is-size-2">{post.artist} - {post.title}</h2>
                <p>Uploaded <i>{new Date(post.createdAt).toDateString()}</i></p>
                <p className="mt-2">{post.description}</p>
                <hr />
                <ul>
                  {
                    post.tracks.map((track, trackKey) => {
                      return (<li key={trackKey} className="mb-1">
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
              {
                props.isDeleteVisible && (
                  <div className="card-footer p-3 is-flex is-justify-content-flex-end">
                    <button onClick={handlePostDelete} data-postid={post.id} className="button is-danger">
                      Delete
                    </button>
                  </div>
                )
              }
            </div>
          </li>);
        })
      }
    </ul>
  )
}

export default PostList;