"use client";

import React from "react";

import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";

import { Post, getPosts } from "@/utils/get-posts";
import PostList from "@/components/PostList";

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
      <PostList posts={posts} />
    </main>
  );
}
