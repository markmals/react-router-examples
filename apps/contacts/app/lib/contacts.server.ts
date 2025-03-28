import { Contact, db } from "./db";
import { seed } from "./db.seed";
import { eq, sql } from "drizzle-orm";

import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export type IContact = typeof Contact.$inferSelect;

// Seed the database if it's empty
const [contacts] = await db.select({ count: sql<number>`count(*)` }).from(Contact);
if (contacts.count === 0) {
    await seed();
}

export async function createContact() {
    await fakeNetwork();
    return await db.insert(Contact).values({
        first: "",
        last: "",
        avatar: "",
        bsky: "",
    });
}

export async function getContact(id?: number) {
    await fakeNetwork(`contact:${id}`);
    const [contact] = await db
        .select()
        .from(Contact)
        .where(eq(Contact.id, id ?? -1));

    return contact;
}

export async function getContacts(query?: string) {
    await fakeNetwork(`getContacts:${query}`);
    let contacts = await db.select().from(Contact);
    if (query) {
        contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }
    return contacts.sort(sortBy("last", "createdAt"));
}

export async function updateContact(id: number, updates: Partial<IContact>) {
    await fakeNetwork();

    // Trim any leading @'s off of bsky handle
    if (updates.bsky && typeof updates.bsky === "string") {
        updates.bsky = updates.bsky.replace(/^@+/, "");
    }

    return await db.update(Contact).set(updates).where(eq(Contact.id, id));
}

export async function deleteContact(id: number) {
    return await db.delete(Contact).where(eq(Contact.id, id));
}

// fake a cache so we don't slow down stuff we've already seen
const fakeCache = new Map<string, boolean>();

export async function fakeNetwork(key?: string): Promise<void> {
    if (!key || !fakeCache.get(key)) {
        if (key) fakeCache.set(key, true);

        return new Promise(res => {
            setTimeout(res, Math.random() * 1000);
        });
    }
}
