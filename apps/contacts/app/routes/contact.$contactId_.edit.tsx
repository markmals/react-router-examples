import { Form, redirect, useNavigate } from "react-router"
import type { Route } from "./+types/contact.$contactId_.edit"
import { fakeNetwork, updateContact } from "~/lib/contacts.server"

export async function loader({ params }: Route.LoaderArgs) {
    // Since we're being smart and using `matches` in the component instead of,
    // `getContact()` here we don't see the loading states, so we have to fake
    // the network latency dirctly in this loader.
    await fakeNetwork(`contact:${params.contactId}`)
    return null
}

export async function action({ request, params }: Route.ActionArgs) {
    const formData = await request.formData()
    const updates = Object.fromEntries(formData)
    await updateContact(Number.parseInt(params.contactId), updates)
    return redirect(`/contact/${params.contactId}`)
}

export default function Component({ matches, params }: Route.ComponentProps) {
    const contact = matches[0].data.contacts.find(c => c.id === Number.parseInt(params.contactId))!
    const navigate = useNavigate()

    return (
        <Form id="contact-form" method="post">
            <p>
                <span>Name</span>
                <input
                    aria-label="First name"
                    defaultValue={contact.first ?? undefined}
                    name="first"
                    placeholder="First"
                    type="text"
                />
                <input
                    aria-label="Last name"
                    defaultValue={contact.last ?? undefined}
                    name="last"
                    placeholder="Last"
                    type="text"
                />
            </p>
            <label>
                <span>Bluesky</span>
                <input
                    defaultValue={contact.bsky ?? undefined}
                    name="bsky"
                    placeholder="jay.bsky.team"
                    type="text"
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    aria-label="Avatar URL"
                    defaultValue={contact.avatar ?? undefined}
                    name="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    type="text"
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea defaultValue={contact.notes ?? undefined} name="notes" rows={6} />
            </label>
            <p>
                <button type="submit">Save</button>
                <button onClick={() => navigate(-1)} type="button">
                    Cancel
                </button>
            </p>
        </Form>
    )
}
