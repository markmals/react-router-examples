import type { ActionFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form, useLoaderData, useNavigate } from "@remix-run/react"
import { updateContact } from "~/lib/contacts.server"

export { loader } from "./contact.$contactId"

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData()
    const updates = Object.fromEntries(formData)
    await updateContact(parseInt(params.contactId!), updates)
    return redirect(`/contact/${params.contactId}`)
}

export default function EditContact() {
    const { contact } = useLoaderData<typeof loader>()
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
                <span>Mastodon</span>
                <input
                    defaultValue={contact.mastodon ?? undefined}
                    name="mastodon"
                    placeholder="@Gargron@mastodon.social"
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
