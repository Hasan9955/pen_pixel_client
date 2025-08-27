import Link from "next/link";
import React from "react";
import styles from "./PostCard.module.css";

type Props = {
  id: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
};

function initials(name?: string) {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PostCard({ id, title, content, author, createdAt }: Props) {
  const date = createdAt ? new Date(createdAt) : null;

  // Format as "27/8/2025, 3:06 PM" (day/month/year, no seconds)
  const formattedDate = date
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "numeric",   // numeric -> "8" (no leading zero)
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date)
    : "—";

  return (
    <article className={styles.card} aria-labelledby={`post-title-${id}`}>
      <div className={styles.header}>
        <div className={styles.avatar} aria-hidden>
          {initials(author)}
        </div>

        <div className={styles.headMeta}>
          <h2 id={`post-title-${id}`} className={styles.title}>
            <Link href={`/posts/${id}`} className={styles.titleLink}>
              {title}
            </Link>
          </h2>

          {/* Meta: date first, then author */}
          <p className={styles.meta}>
            
            <span className={styles.author}>{author ?? "Anonymous"}</span>

            <span className={styles.dot} aria-hidden>•</span>

            <time dateTime={date?.toISOString() ?? ""} className={styles.date}>
              {formattedDate}
            </time>

          </p>
        </div>
      </div>

      <p className={styles.excerpt}>{content}</p>

      <div className={styles.footer}>
        <Link href={`/posts/${id}`} className={styles.readMore}>
          Read more →
        </Link>
      </div>
    </article>
  );
}
