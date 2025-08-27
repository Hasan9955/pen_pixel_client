// app/posts/[id]/page.tsx
import { notFound } from "next/navigation";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default async function PostPage({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(`http://localhost:5000/api/posts/${params.id}`, {
      cache: "no-store", // ensures SSR (fresh data every time)
    });

    if (!res.ok) {
      return notFound();
    }

    const post: Post = await res.json();

    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 mb-6">By {post.author}</p>
        <div className="prose">{post.content}</div>
        <p className="text-sm text-gray-500 mt-6">
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return notFound();
  }
}
