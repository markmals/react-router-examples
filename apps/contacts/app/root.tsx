import { useEffect, type PropsWithChildren } from "react"
import styles from "./index.css?url"
import { createContact, getContacts } from "./lib/contacts.server"
import {
    Form,
    Links,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useNavigate,
    useNavigation,
    useSubmit,
} from "react-router"
import type { Route } from "./+types/root"

export const meta: Route.MetaFunction = () => [{ title: "React Router Contacts" }]

export const links: Route.LinksFunction = () => [
    { rel: "stylesheet", href: styles },
    {
        rel: "icon",
        href: "/favicon-light.png",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
    },
    {
        rel: "icon",
        href: "/favicon-dark.png",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
    },
]

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url)
    const q = url.searchParams.get("q") ?? undefined
    const contacts = await getContacts(q)
    return { contacts, q }
}

export async function action() {
    const contact = await createContact()
    return { contact }
}

export function Layout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta content="width=device-width, initial-scale=1" name="viewport" />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export default function Component({ loaderData }: Route.ComponentProps) {
    const navigation = useNavigation()
    const { contacts, q } = loaderData

    const searching = Boolean(
        navigation.location && new URLSearchParams(navigation.location.search).has("q"),
    )

    const submit = useSubmit()
    const navigate = useNavigate()

    useEffect(() => {
        if (document) {
            document.querySelector<HTMLInputElement>("#q")!.value = q ?? ""
        }
    }, [q])

    return (
        <div id="root">
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form">
                        <input
                            aria-label="Search contacts"
                            className={searching ? "loading" : ""}
                            defaultValue={q}
                            id="q"
                            name="q"
                            onInput={event => {
                                // Remove empty query params when value is empty
                                if (!event.currentTarget.value) {
                                    navigate("/")
                                    return
                                }
                                const isFirstSearch = q === undefined
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                })
                            }}
                            placeholder="Search"
                            type="search"
                        />
                        <div aria-hidden hidden={!searching} id="search-spinner" />
                        <div aria-live="polite" className="sr-only" />
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
    )
}
