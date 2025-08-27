"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RichTextEditor from "../components/RichTextEditor";
import styles from "./create.module.css";

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
      const res = await fetch("https://pen-pixel-server-fawn.vercel.app/api/posts", {
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
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Create Post</h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Title Input */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">Title</label>
            <input
              id="title"
              {...register("title", { required: true })}
              className={styles.input}
              placeholder="Write a concise, descriptive title"
            />
          </div>

          {/* Content Editor */}
          <div className={styles.field}>
            <label className={styles.label}>Content</label>
            <div className={styles.editorWrap}>
              <RichTextEditor onChange={(value) => setEditorContent(value)} />
            </div>
            <p className={styles.helper}>Use the toolbar to format text. Content will be saved when you publish.</p>
          </div>

          {/* Author Input */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="author">Author</label>
            <input
              id="author"
              {...register("author")}
              className={styles.input}
              placeholder="Your name (optional)"
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton}>Publish</button>
            <button
              type="button"
              className={styles.ghostButton}
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
