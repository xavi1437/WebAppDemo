# TaskFlow Multi-Page Demo

A static frontend demo for a future task management platform. This version separates the main website sections into individual pages.

## Pages

- `index.html` — main landing page
- `tutorial.html` — product tutorial / workflow page
- `pricing.html` — pricing plans page
- `resources.html` — resources, guides, and templates page
- `signup.html` — demo signup / waitlist page

## Included files

- `styles.css` — shared responsive design system
- `script.js` — mobile navigation, reveal animations, tutorial card interaction, and local-only signup message
- `README.md` — setup notes

## How to run locally

Open `index.html` directly in your browser, or run a small local server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## How to use with GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder to the repository root.
3. Go to **Settings → Pages**.
4. Choose deployment from the main branch/root folder.
5. Save and wait for GitHub Pages to publish the demo.

## Future backend integration

The signup form currently does not send data anywhere. When your server/API is ready, replace the form submit logic in `script.js` with a `fetch()` call, for example:

```js
await fetch('/api/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, teamSize, goal })
});
```

You can also replace the dashboard preview with real data from an endpoint such as:

```text
GET /api/projects/:projectId/tasks
```
