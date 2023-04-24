import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Form, useFetcher, useLoaderData } from "@remix-run/react"
import { useMemo } from "react"
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
    return updateContact(parseInt(params.contactId!), {
        favorite: formData.get("favorite") === "true",
    })
}

export default function ViewContact() {
    const { contact } = useLoaderData<typeof loader>()
    const hasAvatar = useMemo(() => !!contact.avatar, [contact.avatar])

    return (
        <div id="contact">
            <div>
                <img
                    alt=""
                    key={contact.avatar}
                    src={
                        hasAvatar
                            ? contact.avatar
                            : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    }
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite favorite={contact.favorite!} />
                </h1>

                {contact.mastodon && (
                    <p>
                        <a
                            href={`https://mastodon.social/${contact.mastodon.replace(
                                "@mastodon.social",
                                ""
                            )}`}
                            rel="noreferrer"
                            target="_blank"
                        >
                            {contact.mastodon}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        action="destroy"
                        method="post"
                        onSubmit={event => {
                            if (!confirm("Please confirm you want to delete this record.")) {
                                event.preventDefault()
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

function Favorite({ favorite: initialFavorite }: { favorite: boolean }) {
    const { Form, formData } = useFetcher()

    const favorite = useMemo(() => {
        if (formData) {
            return formData.get("favorite") === "true"
        }

        return initialFavorite
    }, [formData, initialFavorite])

    return (
        <Form method="post">
            <button
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                name="favorite"
                value={favorite ? "false" : "true"}
            >
                {favorite ? "★" : "☆"}
            </button>
        </Form>
    )
}
