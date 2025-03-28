import { Contact, db } from "~/lib/db"

const contacts = [
    {
        id: 1,
        first: "Brooks",
        last: "Lybrand",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:l7sltcx6yitxew2vgcrn72ge/bafkreibg6v7njo3pxsmzxa262j6ikw4i66umygdawz5iduuu3h4tfyprbm@jpeg",
        bsky: "brookslybrand.bsky.social",
    },
    {
        id: 2,
        first: "Mark",
        last: "Dalgleish",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:hucjy724rz245jjd3ismnwcy/bafkreifecuk7zywjcxraqr75ua7hp3jtj2g5zygifh3cmzbe3hpsnqr7ye@jpeg",
        bsky: "markdalgleish.com",
    },
    {
        id: 3,
        first: "Pedro",
        last: "Cattori",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:6zwkx24n4vucdcfgzbwzfy57/bafkreihecdr73d63xajbsrr525j7mih4dymzc5scaz7fr6qtyuouenrheu@jpeg",
        bsky: "pedrocattori.com",
    },
    {
        id: 4,
        first: "Kent C.",
        last: "Dodds",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:xzefkiajzjmmyp6zq6ftczg3/bafkreicjzokch3d33ikmot252ilfmlzfnqv6vbhonzcftdslmql3db5tfm@jpeg",
        bsky: "kentcdodds.com",
    },
    {
        id: 5,
        first: "Jacob",
        last: "Ebey",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:twegdcgytckr5cxm57gyruxa/bafkreidx3bmu6wprocniiyrpwnpwljky6rat7bjccxxoc66ncybhzt5qxu@jpeg",
        bsky: "ebey.bsky.social",
    },
]

export async function seed() {
    try {
        await db.insert(Contact).values(contacts).onConflictDoUpdate({
            target: Contact.id,
            set: Contact,
        })
    } catch (e) {
        console.error(e)
        // process.exit(1);
    }
}
