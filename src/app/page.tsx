"use client";
import { useEffect, useMemo, useState } from "react";
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
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://pen-pixel-server-fawn.vercel.app/api/posts");
        const data = await res.json();
        setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q) ||
        p.author?.toLowerCase().includes(q)
    );
  }, [posts, search]);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Pen Pixel Blog</h1>
          <p className={styles.heroSubtitle}>
            Thoughtful posts about design, code and creativity. Write something that matters.
          </p>

          <div className={styles.controls}>
            <div className={styles.searchWrap}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
                placeholder="Search posts, authors or content..."
                aria-label="Search posts"
              />
            </div>

            <Link href="/create" className={styles.ctaButton}>
              + New Post
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.gridHeader}>
            <h2 className={styles.sectionTitle}>Latest posts</h2>
            <p className={styles.sectionMeta}>
              {loading ? "Loading posts…" : `${filteredPosts.length} post${filteredPosts.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {loading ? (
            <div className={styles.grid}>
              <div className={styles.skeletonCard} />
              <div className={styles.skeletonCard} />
              <div className={styles.skeletonCard} />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No posts found. Try a different search or create a new post.</p>
              <Link href="/create" className={styles.secondaryButton}>
                Create your first post
              </Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredPosts.map((p) => (
                <article key={p._id} className={styles.cardWrapper}>
                  {/* We still use your PostCard component internally for content structure.
                      Styling targets article children to create the new card look. */}
                  <PostCard
                    id={p._id}
                    title={p.title}
                    content={p.content}
                    author={p.author}
                    createdAt={p.createdAt}
                  />
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
