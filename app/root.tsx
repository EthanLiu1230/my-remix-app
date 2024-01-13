import { Form, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";
import appStylesHref from "./app.css";

/**
 * Every route can export a links function. They will be collected and rendered into the <Links /> component we rendered in app/root.tsx.
 */
export const links: LinksFunction = () => [{ rel: "stylesheet", href: appStylesHref }];

export default function App() {
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
        <Form id="search-form" role="search">
          <input id="q" aria-label="Search contacts" placeholder="Search" type="search" name="q" />
          <div id="search-spinner" aria-hidden hidden={true} />
        </Form>
        <Form method="post">
          <button type="submit">New</button>
        </Form>
      </div>
      <nav>
        <ul>
          <li>
            <a href={`/contacts/1`}>Your Name</a>
          </li>
          <li>
            <a href={`/contacts/2`}>Your Friend</a>
          </li>
        </ul>
      </nav>
    </div>

    <div id="detail">
      <Outlet />
    </div>
    <ScrollRestoration />
    <Scripts />
    <LiveReload />
    </body>
    </html>
  );
}
