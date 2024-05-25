import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";

type Track = {
  name: string,
  path: string
};

type Post = {
  title: string,
  description?: string,
  tracks: Track[],
  artist: string,
  createdAt: string,
  owner?: string
};

const convertDataToPosts = (data: any) => {
  const posts: Post[] = [];

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
        createdAt: result.createdAt,
        owner: result.owner
      });
    }
  }

  return posts;
};

const getPosts = async (authMode: any): Promise<Post[]> => {
  const client = generateClient<Schema>();
  const {data, errors} = (await client.models.Post.list({authMode}));

  if (errors) {
    console.error("Unable to list posts: %o", errors);
  }

  return convertDataToPosts(data);
};

const getPostsForOwner = async (owner: string) => {
  const client = generateClient<Schema>();
  const {data, errors} = (await client.models.Post.list({filter: {owner: {eq: owner}}}));

  if (errors) {
    console.error("Unable to list posts: %o", errors);
  }

  return convertDataToPosts(data);
};

export { getPosts, getPostsForOwner };
export type { Track, Post };