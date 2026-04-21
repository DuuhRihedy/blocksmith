import type { JSONContent } from "@tiptap/core";

export interface BlockDocument {
  id: string;
  title: string;
  content: JSONContent | null;
  createdAt: number;
  updatedAt: number;
}

export function createDocument(title?: string): BlockDocument {
  return {
    id: crypto.randomUUID(),
    title: title || "Sem título",
    content: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
