import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
    Form,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigate,
    useNavigation,
    useSubmit,
} from "@remix-run/react"
import { useEffect } from "react"
import styles from "./index.css?url"
import { createContact, getContacts } from "./lib/contacts.server"

export const meta: MetaFunction = () => [
    { charSet: "utf-8" },
    { title: "Remix Contacts" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
]

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
]

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const q = url.searchParams.get("q") ?? undefined
    const contacts = await getContacts(q)
    return json({ contacts, q })
}

export async function action() {
    const contact = await createContact()
    return json({ contact })
}

export default function ContactsApp() {
    const navigation = useNavigation()
    const { contacts, q } = useLoaderData<typeof loader>()
    const submit = useSubmit()
    const navigate = useNavigate()

    const searching =
        navigation.location && new URLSearchParams(navigation.location.search).has("q")

    useEffect(() => {
        if (document) {
            document.querySelector<HTMLInputElement>("#q")!.value = q ?? ""
        }
    }, [q])

    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <div id="root">
                    <div id="sidebar">
                        <h1>Remix Contacts</h1>
                        <div>
                            <Form id="search-form" role="search">
                                <input
                                    aria-label="Search contacts"
                                    className={searching ? "loading" : ""}
                                    defaultValue={q}
                                    id="q"
                                    name="q"
                                    onChange={event => {
                                        // Remove empty query params when value is empty
                                        if (!event.currentTarget.value) {
                                            navigate("/")
                                            return
                                        }
                                        const isFirstSearch = q === null
                                        submit(event.currentTarget.form, {
                                            replace: !isFirstSearch,
                                        })
                                    }}
                                    placeholder="Search"
                                    type="search"
                                />
                                <div aria-hidden hidden={!searching} id="search-spinner" />
                                <div aria-live="polite" className="sr-only"></div>
                            </Form>
                            <Form method="post">
                                <button type="submit">New</button>
                            </Form>
                        </div>
                        <nav>
                            {contacts.length ? (
                                <ul>
                                    {contacts.map(contact => (
                                        <li key={contact.id}>
                                            <NavLink
                                                className={({ isActive, isPending }) =>
                                                    isActive ? "active" : isPending ? "pending" : ""
                                                }
                                                to={`contact/${contact.id}`}
                                            >
                                                {contact.first || contact.last ? (
                                                    <>
                                                        {contact.first} {contact.last}
                                                    </>
                                                ) : (
                                                    <i>No Name</i>
                                                )}
                                                {contact.favorite && <span>★</span>}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>
                                    <i>No contacts</i>
                                </p>
                            )}
                        </nav>
                    </div>
                    <div className={navigation.state === "loading" ? "loading" : ""} id="detail">
                        <Outlet />
                    </div>
                </div>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}
