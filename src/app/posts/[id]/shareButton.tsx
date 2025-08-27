"use client";

import React, { useState, useEffect } from "react";
import styles from "./Post.module.css";

type Props = {
    path: string; // e.g. `/posts/${params.id}`
    title?: string;
};

export default function ShareButton({ path, title }: Props) {
    const [msg, setMsg] = useState<string | null>(null);

    // clear messages after 2.2s
    useEffect(() => {
        if (!msg) return;
        const t = setTimeout(() => setMsg(null), 2200);
        return () => clearTimeout(t);
    }, [msg]);

    const handleShare = async () => {
        try {
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const url = origin + path;

            if (navigator.share) {
                await navigator.share({
                    title: title ?? document.title,
                    text: `${title ?? "Check out this post"}`,
                    url,
                });
                setMsg("Shared!");
                return;
            }

            // Fallback: copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
                setMsg("Link copied to clipboard");
                return;
            }

            // Older fallback if needed
            const textarea = document.createElement("textarea");
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setMsg("Link copied to clipboard");
        } catch (err) {
            console.error("Share error:", err);
            setMsg("Could not share — try manually");
        }
    };

    return (
        <div style={{ position: "relative", display: "inline-block" }}>

            <button type="button"
                onClick={handleShare}
                className={styles.ghostButton}
                aria-label="Share this post"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4m0 0L8 6m4-4v16" />
                </svg>
                Share
            </button>

            {msg && (
                <div
                    role="status"
                    aria-live="polite"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 8px)",
                        background: "rgba(15,23,42,0.95)",
                        color: "#fff",
                        padding: "6px 10px",
                        borderRadius: 8,
                        fontSize: "0.85rem",
                        boxShadow: "0 8px 20px rgba(2,6,23,0.12)",
                        whiteSpace: "nowrap",
                        zIndex: 40,
                    }}
                >
                    {msg}
                </div>
            )}
        </div>
    );
}
