import Link from "next/link";
import React from "react";

type Props = {
  id: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
};

export default function PostCard({ id, title, content, author, createdAt }: Props) {
  return (
    <article className="border rounded-md p-4 shadow-sm hover:shadow-md transition">
      <h2 className="text-xl font-semibold">
        <Link href={`/posts/${id}`}>{title}</Link>
      </h2>
      <p className="text-sm text-gray-600 mt-1">{author} • {new Date(createdAt || "").toLocaleString()}</p>
      <p className="mt-3 text-gray-800 line-clamp-3">{content}</p>
      <div className="mt-3">
        <Link className="text-blue-600" href={`/posts/${id}`}>Read more →</Link>
      </div>
    </article>
  );
}

