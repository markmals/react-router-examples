import { deleteContact } from "~/lib/contacts.server"
import type { Route } from "./+types/contact.$contactId_.destroy"
import { redirect } from "react-router"

export async function action({ params }: Route.ActionArgs) {
    await deleteContact(Number.parseInt(params.contactId))
    return redirect("/")
}

export function ErrorBoundary() {
    return <div>Oops! There was an error.</div>
}
