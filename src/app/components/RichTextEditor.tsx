"use client";

import React, { useState, useRef } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import { Bold, Italic, Underline } from "lucide-react";
import styles from "./Rich.module.css";

type Props = {
  onChange: (value: string) => void; // plain text (you can change to raw/HTML later)
};

export default function RichTextEditor({ onChange }: Props) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const handleChange = (state: EditorState) => {
    setEditorState(state);
    const content = state.getCurrentContent();
    const text = content.getPlainText();
    onChange(text);
  };

  const handleKeyCommand = (command: string, state: EditorState) => {
    const newState = RichUtils.handleKeyCommand(state, command) as EditorState | null;
    if (newState) {
      setEditorState(newState);
      const content = newState.getCurrentContent();
      onChange(content.getPlainText());
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style: string) => {
    const newState = RichUtils.toggleInlineStyle(editorState, style);
    setEditorState(newState);
    // re-focus editor after toggling
    setTimeout(() => editorRef.current?.focus?.(), 0);
  };

  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        {/* use onMouseDown to prevent editor blur (keeps selection) */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle("BOLD");
          }}
          className={`${styles.btn} ${currentStyle.has("BOLD") ? styles.active : ""}`}
          aria-pressed={currentStyle.has("BOLD")}
          title="Bold (Ctrl/Cmd+B)"
        >
          <Bold className={styles.icon} />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle("ITALIC");
          }}
          className={`${styles.btn} ${currentStyle.has("ITALIC") ? styles.active : ""}`}
          aria-pressed={currentStyle.has("ITALIC")}
          title="Italic (Ctrl/Cmd+I)"
        >
          <Italic className={styles.icon} />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle("UNDERLINE");
          }}
          className={`${styles.btn} ${currentStyle.has("UNDERLINE") ? styles.active : ""}`}
          aria-pressed={currentStyle.has("UNDERLINE")}
          title="Underline (Ctrl/Cmd+U)"
        >
          <Underline className={styles.icon} />
        </button>
      </div>

      <div
        className={styles.editorContainer}
        onClick={() => editorRef.current?.focus?.()}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleChange}
          handleKeyCommand={handleKeyCommand}
          placeholder="Write your blog content here..."
        />
      </div>
    </div>
  );
}
