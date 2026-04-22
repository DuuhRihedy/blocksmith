import Dexie, { type Table } from 'dexie';

export interface Document {
  id?: number;
  title: string;
  content: any; // TipTap JSON content
  updatedAt: number;
  createdAt: number;
}

export class BlocksmithDB extends Dexie {
  documents!: Table<Document>;

  constructor() {
    super('BlocksmithDB');
    this.version(1).stores({
      documents: '++id, title, updatedAt' // Primary key and indexed props
    });
  }
}

export const db = new BlocksmithDB();
