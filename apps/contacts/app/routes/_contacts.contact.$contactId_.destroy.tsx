import type { ActionFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { deleteContact } from "~/lib/contacts.server"

export async function action({ params }: ActionFunctionArgs) {
    await deleteContact(parseInt(params.contactId!))
    return redirect("/")
}

export function ErrorBoundary() {
    return <div>Oops! There was an error.</div>
}
