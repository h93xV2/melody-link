"use client";

import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";

import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";

type Post = {
  title: string,
  description: string,
  tags: string[],
  tracks: string[],
  // TODO: Add artist name
};

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const client = generateClient<Schema>();
    const results: Post[] = [];

    client.models.Post.list({authMode: 'identityPool'}).then((result) => {
      result.data.forEach(post => {
        if (post.title && post.description && post.tags && post.tracks && post.owner) {
          results.push({
            title: post.title,
            description: post.description,
            tags: post.tags as string[],
            tracks: post.tracks as string[]
          });
        }
      });

      if (result.errors) {
        console.error("Problem reading posts %o", result.errors);
      }

      setPosts([...results]);
    }).catch(console.error);
  }, [])

  return (
    <main>
      <h1 className="title is-size-1">MelodyLink</h1>
      <ul>
        {
          posts.map((post, postKey) => {
            return (<li key={postKey} className="mb-3">
              <div className="card">
                <div className="card-content">
                  <h2 className="is-size-2">{post.title}</h2>
                  <div className="mb-2">
                    { post.tags.map((tag, tagKey) => <span className="tag mr-1" key={tagKey}>#{tag}</span>) }
                  </div>
                  <p>{post.description}</p>
                  <ul>
                    {
                      post.tracks.map((track, trackKey) => <li key={trackKey}>{track.split("/")[3].split(".")[0]}</li>)
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
