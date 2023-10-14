import type { ActionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { deleteContact } from "~/lib/contacts.server"

export async function action({ params }: ActionArgs) {
    await deleteContact(parseInt(params.contactId!))
    return redirect("/")
}

export function ErrorBoundary() {
    return <div>Oops! There was an error.</div>
}
