import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import Link from "next/link";

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
        const res = await fetch("http://localhost:4000/api/posts");
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
    <main className="max-w-3xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Blog</h1>
        <Link href="/create" className="bg-blue-600 text-white px-4 py-2 rounded">New Post</Link>
      </header>

      {loading ? <p>Loading...</p> : (
        <div className="space-y-4">
          {posts.map(p => (
            <PostCard key={p._id} id={p._id} title={p.title} content={p.content} author={p.author} createdAt={p.createdAt} />
          ))}
        </div>
      )}
    </main>
  );
}
