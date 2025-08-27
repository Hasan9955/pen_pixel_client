import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./Post.module.css";
import ShareButton from "./shareButton";

interface Post {
  _id: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
}

function initials(name?: string) {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function PostPage({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(
      `https://pen-pixel-server-fawn.vercel.app/api/posts/${params.id}`,
      { cache: "no-store" }
    );

    if (!res.ok) return notFound();

    const post: Post = await res.json();

    const date = post.createdAt ? new Date(post.createdAt) : null;
    const formattedDate = date
      ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date)
      : "—";

    // simple reading time estimate (200 wpm)
    const words = (post.content || "").trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));

    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.topRow}>
            <Link href="/" className={styles.backLink}>
              ← Back
            </Link>

            <div className={styles.actions}>
              <ShareButton path={`/posts/${params.id}`} title={post.title} />
            </div>
          </div>

          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>

            <div className={styles.metaRow}>
              <div className={styles.avatar} aria-hidden>
                {initials(post.author)}
              </div>

              <div className={styles.metaText}>
                <time dateTime={date?.toISOString() ?? ""} className={styles.date}>
                  {formattedDate}
                </time>
                <span className={styles.dot} aria-hidden>
                  •
                </span>
                <span className={styles.author}>{post.author ?? "Anonymous"}</span>
                <span className={styles.dot} aria-hidden>
                  •
                </span>
                <span className={styles.readTime}>{minutes} min read</span>
              </div>
            </div>
          </header>

          <article className={styles.contentArea}>
            {/* keep plain text safe and preserve line breaks */}
            <div className={styles.content}>{post.content}</div>
          </article>
        </div>
      </main>
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return notFound();
  }
}
