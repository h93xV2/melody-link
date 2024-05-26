import { Post, getPostsForArtist, getPosts } from "@/utils/get-posts";
import { useEffect, useState } from "react";
import PostList from "./PostList";

function UserPosts(props: {userName: string}) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPostsForArtist(props.userName).then((result: Post[]) => {
      setPosts(result);
    });
  }, []);

  return (
    <main>
      <PostList posts={posts} isDeleteVisible={true} />
    </main>
  );
}

export default UserPosts;