import { useState, useCallback, useEffect } from "react";
import type { JSONContent } from "@tiptap/core";
import { BlockDocument, createDocument } from "../types/document";

const STORAGE_KEY = "blocksmith-documents";
const ACTIVE_KEY = "blocksmith-active-doc";

function loadDocuments(): BlockDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted data
  }
  // Create a default document
  const initial = createDocument("Meu primeiro documento");
  localStorage.setItem(STORAGE_KEY, JSON.stringify([initial]));
  return [initial];
}

function loadActiveId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

function saveDocuments(docs: BlockDocument[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

function saveActiveId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function useDocuments() {
  const [documents, setDocuments] = useState<BlockDocument[]>(loadDocuments);
  const [activeId, setActiveIdState] = useState<string>(() => {
    const saved = loadActiveId();
    const docs = loadDocuments();
    if (saved && docs.find((d) => d.id === saved)) return saved;
    return docs[0]?.id || "";
  });

  const activeDocument = documents.find((d) => d.id === activeId) || null;

  // Persist documents on change
  useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  const setActiveId = useCallback((id: string) => {
    setActiveIdState(id);
    saveActiveId(id);
  }, []);

  const addDocument = useCallback((title?: string) => {
    const doc = createDocument(title);
    setDocuments((prev) => [doc, ...prev]);
    setActiveId(doc.id);
    return doc;
  }, [setActiveId]);

  const deleteDocument = useCallback(
    (id: string) => {
      setDocuments((prev) => {
        const next = prev.filter((d) => d.id !== id);
        if (next.length === 0) {
          const fallback = createDocument("Sem título");
          setActiveId(fallback.id);
          return [fallback];
        }
        if (activeId === id) {
          setActiveId(next[0].id);
        }
        return next;
      });
    },
    [activeId, setActiveId]
  );

  const renameDocument = useCallback((id: string, title: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title, updatedAt: Date.now() } : d))
    );
  }, []);

  const updateContent = useCallback((id: string, content: JSONContent) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, content, updatedAt: Date.now() } : d))
    );
  }, []);

  const duplicateDocument = useCallback(
    (id: string) => {
      const doc = documents.find((d) => d.id === id);
      if (!doc) return;
      const copy = createDocument(`${doc.title} (cópia)`);
      copy.content = doc.content ? JSON.parse(JSON.stringify(doc.content)) : null;
      setDocuments((prev) => [copy, ...prev]);
      setActiveId(copy.id);
    },
    [documents, setActiveId]
  );

  const exportDocument = useCallback(
    (id: string, format: "json" | "html") => {
      const doc = documents.find((d) => d.id === id);
      if (!doc) return;

      let data: string;
      let filename: string;
      let mime: string;

      if (format === "json") {
        data = JSON.stringify({ title: doc.title, content: doc.content }, null, 2);
        filename = `${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
        mime = "application/json";
      } else {
        // HTML export will be handled by the editor component
        data = "";
        filename = `${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}.html`;
        mime = "text/html";
      }

      if (!data) return;

      const blob = new Blob([data], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    [documents]
  );

  const importDocument = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const raw = e.target?.result as string;
          const parsed = JSON.parse(raw);
          const doc = createDocument(parsed.title || file.name.replace(/\.json$/, ""));
          doc.content = parsed.content || parsed;
          setDocuments((prev) => [doc, ...prev]);
          setActiveId(doc.id);
        } catch {
          alert("Arquivo inválido. Use um JSON exportado pelo Blocksmith.");
        }
      };
      reader.readAsText(file);
    },
    [setActiveId]
  );

  return {
    documents,
    activeId,
    activeDocument,
    setActiveId,
    addDocument,
    deleteDocument,
    renameDocument,
    updateContent,
    duplicateDocument,
    exportDocument,
    importDocument,
  };
}
