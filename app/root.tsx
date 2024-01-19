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
  useNavigation, useSubmit
} from "@remix-run/react";

import { json, LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";

import appStylesHref from "./app.css";
import { createEmptyContact, getContacts } from "~/data";
import { useEffect } from "react";

/**
 * Every route can export a links function. They will be collected and rendered into the <Links /> component we rendered in app/root.tsx.
 */
export const links: LinksFunction = () => [{ rel: "stylesheet", href: appStylesHref }];

/**
 * Loader runs on server side, handles `GET` request
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

/**
 * Action accept handles form's `POST` request.
 *
 * Remix also use action's triggering as a hint to auto revalidate.
 */
export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

export default function App() {

  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
    <div id="sidebar">
      <h1>Remix Contacts</h1>
      <div>
        <Form id="search-form" role="search" onChange={(event) => submit(event.currentTarget)}>
          <input id="q" aria-label="Search contacts" placeholder="Search" type="search" name="q"
                 className={searching ? "loading" : ""}
                 defaultValue={q || ""} />
          <div id="search-spinner" aria-hidden hidden={!searching} />
        </Form>
        <Form method="post">
          <button type="submit">New</button>
        </Form>
      </div>
      <nav>
        {contacts.length ? (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <NavLink className={
                  ({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                        ? "pending"
                        : ""
                } to={`contacts/${contact.id}`}>
                  {contact.first || contact.last ? (
                    <>
                      {contact.first} {contact.last}
                    </>
                  ) : (
                    <i>No Name</i>
                  )}
                  {contact.favorite ? (
                    <span>★</span>
                  ) : null}
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

    <div
      id="detail"
      className={navigation.state === "loading" && !searching ? "loading" : ""}
    >
      <Outlet />
    </div>
    <ScrollRestoration />
    <Scripts />
    <LiveReload />
    </body>
    </html>
  );
}
