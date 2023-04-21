import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useLoaderData, useNavigate } from "@remix-run/react"
import { getContact, updateContact } from "~/lib/contacts.server"

export async function loader({ params }: LoaderArgs) {
    const contact = await getContact(parseInt(params.contactId!))

    if (!contact) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        })
    }

    return json({ contact })
}

export async function action({ request, params }: ActionArgs) {
    let formData = await request.formData()
    let updates = Object.fromEntries(formData)
    await updateContact(parseInt(params.contactId!), updates)
    return redirect(`/contact/${params.contactId}`)
}

export default function EditContact() {
    let { contact } = useLoaderData<typeof loader>()
    let navigate = useNavigate()

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
                <span>mastodon</span>
                <input
                    defaultValue={contact.mastodon ?? undefined}
                    name="mastodon"
                    placeholder="@jack"
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
