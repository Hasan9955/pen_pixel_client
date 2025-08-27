"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PostCard from "./components/PostCard";
import styles from "./Home.module.css"; 

type Post = {
  _id: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://pen-pixel-server-fawn.vercel.app/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Blog</h1>
        <Link href="/create" className={styles.newPostButton}>New Post</Link>
      </header>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <div className={styles.postsList}>
          {posts.map(p => (
            <PostCard
              key={p._id}
              id={p._id}
              title={p.title}
              content={p.content}
              author={p.author}
              createdAt={p.createdAt}
            />
          ))}
        </div>
      )}
    </main>
  );
}
