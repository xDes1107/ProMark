Knowledge

Definitions:
Positive - Understood
Negative - Not understood

Positive:

Negative:

## Idea 1: Reply to "hello" on WhatsApp //DEPRECATED

Status: Design and concepts complete; implementation is for the user to code.

Idea:
When a user sends "hello" to the WhatsApp test number, the app replies: "Hello to you too!"

Design:
1. Meta sends an incoming-message webhook to the app's public HTTPS URL.
2. The backend reads the WhatsApp message text from the webhook payload.
3. It trims whitespace and compares the text to "hello" without case sensitivity.
4. If it matches, the backend sends "Hello to you too!" using the WhatsApp Cloud API, with the sender number as the recipient.
5. The backend returns a success response to the webhook request. For messages that do not match, it does not send a reply yet.

Concepts:
- A webhook is an HTTP request sent by Meta to notify the backend about an incoming message.
- The webhook callback needs a GET verification handler and a POST event handler. Meta uses GET to verify the callback; incoming message events arrive by POST.
- Receiving a message and replying are separate HTTP interactions: Meta POSTs to our backend, then our backend POSTs to Meta's messages endpoint.
- The recipient's phone number comes from the incoming webhook payload. The sending business number is identified by the configured Phone Number ID.
- The Cloud API access token and webhook verification token are secrets and belong in environment variables, never hard-coded or committed.
- Message text should be checked defensively because webhook events may be status updates or unsupported message types rather than text messages.

Learning check:
- Positive -
- Negative -

Implementation target:
Add the webhook verification and incoming-message handling in the backend, then demonstrate the fixed "hello" reply with the WhatsApp test number. Keep the scope to this one phrase; professional search can come later.

## Idea 2: Search professionals from the app

Status: Implemented.

Idea:
Add a simple search bar so a visitor can find professionals by typing a name, trade, company, or location.

Current project state:
The frontend search page calls the Express `/professionals` API with the search term in the `q` query parameter.

Design:
1. Create a minimal page with a search input and a results area.
2. Send submitted searches to `GET /professionals?q=...`.
3. Filter by name, trade, company, and location using a parameterized, case-insensitive database query.
4. Display matching professionals as simple cards or rows; show clear loading, empty, and error states.

Concepts:
- The frontend is the part of the app that renders the search field and results in the browser.
- `fetch` sends the search term to the Express API and parses its JSON response.
- The API uses a SQL parameter for the term rather than interpolating user input into SQL.
- The separate frontend and API origins require the API to allow the frontend origin through CORS.
- Search input should have an accessible label, and the page should distinguish loading, results, no matches, and errors.

Learning check:
- Positive - professionals.ts slightly understood
- Negative - HTML code, server.ts code

Implementation target:
Keep the browser UI and API search behavior in sync if the search feature is extended. Use plain HTML, CSS, and JavaScript unless a frontend framework is introduced later. Do not change the WhatsApp flow as part of this idea.

AI review notes:
- The main search flow is present: the page sends `q` to the API, and the API uses `ILIKE` with a parameterized value to search the four selected columns.
- The frontend uses `textContent` when rendering database values, which avoids treating a professional's name or details as HTML.
- Review issue: the `page` script in `backend/package.json` points to `../frontend/index.ts`, but that file does not exist. The checked-in frontend files are `frontend/page.html`, `frontend/launch.js`, and `frontend/index/index.ts` (which currently contains database connection setup, not a frontend server). Check which launch path you intend to use.
- Review issue: `frontend/launch.js` hard-codes this machine's absolute backend folder path. That may prevent it from starting on another computer.
- To see the page with the provided Python static server, open `http://localhost:8000/page.html`; the API must also run at `http://localhost:3000` and allow the page's origin.

Concepts to revisit:
- CORS allows a page served from one origin (host/port) to make a browser request to an API at another origin. Here the expected origin is `http://localhost:8000` and the API is `http://localhost:3000`.
- A parameter such as `$1` keeps the search value separate from SQL syntax; `%${query}%` makes it a substring match for `ILIKE`.
- `fetch` resolves even for HTTP error responses, so checking `response.ok` before parsing success data is useful.

Design:

Concepts:
