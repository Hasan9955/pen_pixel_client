"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RichTextEditor from "../components/RichTextEditor";

type FormValues = {
  title: string;
  content: string;
  author?: string;
};

export default function Create() {
  const { register, handleSubmit } = useForm<FormValues>();
  const router = useRouter();
  const [editorContent, setEditorContent] = useState("");

  const onSubmit = async (data: FormValues) => {
    try {
      // Take title and author from form, content from Draft.js
      const postData = {
        title: data.title,
        author: data.author,
        content: editorContent,
      };

      console.log(postData);
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        router.push("/"); // back to homepage
      } else {
        console.error("Failed to create post", await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium">Content</label>
          <RichTextEditor onChange={(value) => setEditorContent(value)} />
        </div>

        {/* Author Input */}
        <div>
          <label className="block text-sm font-medium">Author</label>
          <input
            {...register("author")}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Publish
        </button>
      </form>
    </main>
  );
}
