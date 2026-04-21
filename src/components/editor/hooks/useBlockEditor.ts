import { useEditor } from "@tiptap/react";
import { useCallback, useMemo } from "react";
import type { JSONContent, Editor } from "@tiptap/core";

import { StarterKit } from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { Typography } from "@tiptap/extension-typography";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";

interface UseBlockEditorOptions {
  content?: JSONContent;
  onChange?: (content: JSONContent) => void;
  editable?: boolean;
}

interface UseBlockEditorReturn {
  editor: Editor | null;
  getJSON: () => JSONContent | undefined;
  getHTML: () => string;
  getText: () => string;
  isEmpty: boolean;
  characterCount: number;
  wordCount: number;
  clearContent: () => void;
  setContent: (content: JSONContent) => void;
}

export function useBlockEditor({
  content,
  onChange,
  editable = true,
}: UseBlockEditorOptions = {}): UseBlockEditorReturn {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Digite '/' para ver os comandos..." }),
      TextStyle,
      Color,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Typography,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  const getJSON = useCallback(() => editor?.getJSON(), [editor]);
  const getHTML = useCallback(() => editor?.getHTML() ?? "", [editor]);
  const getText = useCallback(() => editor?.getText() ?? "", [editor]);

  const clearContent = useCallback(() => {
    editor?.commands.clearContent(true);
  }, [editor]);

  const setContent = useCallback(
    (newContent: JSONContent) => {
      editor?.commands.setContent(newContent);
    },
    [editor]
  );

  const isEmpty = editor?.isEmpty ?? true;
  const text = editor?.getText() ?? "";
  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return useMemo(
    () => ({
      editor,
      getJSON,
      getHTML,
      getText,
      isEmpty,
      characterCount,
      wordCount,
      clearContent,
      setContent,
    }),
    [editor, getJSON, getHTML, getText, isEmpty, characterCount, wordCount, clearContent, setContent]
  );
}
