import Database from "@tauri-apps/plugin-sql";

let db : Database | null = null;

export default async () : Promise<Database> => {
    if (!db) { 
        db = await Database.load("sqlite:data.db");
        return db;
    }
    return db;
};