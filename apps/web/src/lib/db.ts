import Dexie, { type EntityTable } from "dexie";

export interface DocumentSummary {
    id: string;
    title: string;
    emoji: string | null;
    updatedAt: string;
    createdAt: string;
}

export interface Document extends DocumentSummary {
    content: string;
}

const db = new Dexie("blocksmith") as Dexie & {
    documents: EntityTable<Document, "id">;
};

db.version(1).stores({
    documents: "id, updatedAt",
});

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export const api = {
    documents: {
        list: async (): Promise<DocumentSummary[]> => {
            const docs = await db.documents
                .orderBy("updatedAt")
                .reverse()
                .toArray();
            return docs.map(({ content, ...summary }) => summary);
        },

        get: async (id: string): Promise<Document> => {
            const doc = await db.documents.get(id);
            if (!doc) throw new Error(`Document ${id} not found`);
            return doc;
        },

        create: async (data?: {
            title?: string;
            emoji?: string;
        }): Promise<Document> => {
            const now = new Date().toISOString();
            const doc: Document = {
                id: generateId(),
                title: data?.title || "Sem título",
                content: "{}",
                emoji: data?.emoji || "📄",
                createdAt: now,
                updatedAt: now,
            };
            await db.documents.add(doc);
            return doc;
        },

        update: async (
            id: string,
            data: { title?: string; content?: string; emoji?: string }
        ): Promise<Document> => {
            await db.documents.update(id, {
                ...data,
                updatedAt: new Date().toISOString(),
            });
            const doc = await db.documents.get(id);
            if (!doc) throw new Error(`Document ${id} not found`);
            return doc;
        },

        delete: async (id: string): Promise<{ deleted: boolean }> => {
            await db.documents.delete(id);
            return { deleted: true };
        },
    },
};

export async function backupAll(): Promise<void> {
    const mod = await import("file-saver");
    const saveAs = mod.default?.saveAs || mod.saveAs || mod.default;
    const docs = await db.documents.toArray();
    const data = {
        version: 1,
        exportedAt: new Date().toISOString(),
        documents: docs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });
    const date = new Date().toISOString().split("T")[0];
    saveAs(blob, `blocksmith-backup-${date}.json`);
}

export async function restoreAll(
    file: File
): Promise<{ imported: number; skipped: number }> {
    const text = await file.text();
    const data = JSON.parse(text);

    let docs: Document[] = [];

    if (data.version && data.documents) {
        docs = data.documents;
    } else if (Array.isArray(data)) {
        docs = data;
    } else if (data.id && data.content) {
        docs = [data];
    } else {
        throw new Error("Formato de backup não reconhecido");
    }

    const existingIds = new Set(
        (await db.documents.toArray()).map((d) => d.id)
    );

    const newDocs = docs.filter((d) => !existingIds.has(d.id));
    if (newDocs.length > 0) {
        await db.documents.bulkAdd(newDocs);
    }

    return { imported: newDocs.length, skipped: docs.length - newDocs.length };
}
