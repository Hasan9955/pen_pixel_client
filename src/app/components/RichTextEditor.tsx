"use client";

import { useState, useRef, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { Bold, Italic, Underline } from "lucide-react";

type Props = {
  onChange: (value: string) => void; // send HTML string
};

export default function RichTextEditor({ onChange }: Props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef<Editor>(null);

  const handleChange = (state: EditorState) => {
    setEditorState(state);

    // Convert content to plain text OR raw JSON
    const content = state.getCurrentContent();
    const raw = convertToRaw(content);
    const text = content.getPlainText(); // plain text
    onChange(text); // send plain text to parent
  };

  const toggleInlineStyle = (style: string) => {
    handleChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          className="px-2 py-1 border rounded"
          onClick={() => toggleInlineStyle("BOLD")}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded"
          onClick={() => toggleInlineStyle("ITALIC")}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded"
          onClick={() => toggleInlineStyle("UNDERLINE")}
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>

      <div
        className="min-h-[150px] p-2 border rounded cursor-text"
        onClick={() => editorRef.current?.focus()}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleChange}
          placeholder="Write your blog content..."
        />
      </div>
    </div>
  );
}
