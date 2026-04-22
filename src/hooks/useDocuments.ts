import { useLiveQuery } from "dexie-react-hooks";
import { db, type Document } from "../db/database";
import { useCallback } from "react";

export function useDocuments() {
  const documents = useLiveQuery(() => db.documents.orderBy("updatedAt").reverse().toArray());

  const saveDocument = useCallback(async (title: string, content: any, id?: number) => {
    const now = Date.now();
    if (id) {
      await db.documents.update(id, {
        title,
        content,
        updatedAt: now,
      });
      return id;
    } else {
      const newId = await db.documents.add({
        title,
        content,
        createdAt: now,
        updatedAt: now,
      });
      return newId as number;
    }
  }, []);

  const deleteDocument = useCallback(async (id: number) => {
    await db.documents.delete(id);
  }, []);

  const getDocument = useCallback(async (id: number) => {
    return await db.documents.get(id);
  }, []);

  return {
    documents,
    saveDocument,
    deleteDocument,
    getDocument,
    isLoading: documents === undefined,
  };
}
