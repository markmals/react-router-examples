import type { LinksFunction, V2_MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"
import { createContact } from "./lib/contacts.server"
import styles from "./styles/index.css"

export const meta: V2_MetaFunction = () => [
    { charSet: "utf-8" },
    { title: "Remix Contacts" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
]

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
]

export async function action() {
    const contact = await createContact()
    return json({ contact })
}

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}
