# Making a Desuko plugin

A plugin adds a small panel to Desuko: notes, a timer, a checklist, anything that runs from its
own files. It is a zip of static web files with a `plugin.json` at the top. People add it in
Settings → Plugins (from a file) or Settings → Discover → Plugins (from the list), after
reviewing what it asks for.

## plugin.json

```json
{
  "schemaVersion": 1,
  "id": "my-notes",
  "name": "My notes",
  "version": "1.0.0",
  "description": "A note that's kept between sessions.",
  "author": "Your name",
  "entry": "index.html",
  "permissions": ["storage"]
}
```

| Field           | Required | Notes                                                            |
| --------------- | -------- | ---------------------------------------------------------------- |
| `schemaVersion` | yes      | `1`                                                              |
| `id`            | yes      | lower-case letters, digits and `-`, up to 48 characters          |
| `name`          | yes      | up to 64 characters                                              |
| `version`       | yes      | semver, e.g. `1.0.0`                                             |
| `description`   | no       | up to 300 characters                                             |
| `author`        | no       |                                                                  |
| `entry`         | no       | the page to show, default `index.html`                           |
| `permissions`   | no       | any of `storage`, `chat.draft`, `notify`; the user approves them |

Only web files are kept (HTML, JS, CSS, JSON, images, fonts, audio, video, WebAssembly); anything
else in the zip is dropped. 20 MB and 500 files at most. Name the zip `.desuko-plugin` (or keep
`.zip`):

```powershell
Compress-Archive -Path my-notes/* -DestinationPath my-notes.zip
```

## What a plugin can do

A plugin runs in a locked-down frame:

- It runs its own scripts and styles from its own files. No inline scripts, no `eval`, no network
  (`fetch`, WebSocket, remote images), no forms, no popups, no nested frames, no cookies or
  `localStorage`.
- It talks to Desuko only with `postMessage` to `window.parent`. Copy
  [`plugins/desuko.js`](plugins/desuko.js) into your plugin and load it from your page:

```js
const hello = await desuko.ready(); // API version, locale, granted permissions, theme
await desuko.storage.set('note', 'Buy tea'); // needs "storage" (256 KB per plugin)
await desuko.chat.draft('Summarize my note'); // needs "chat.draft": fills the quick ask box
await desuko.notify('Timer', 'Time for a break'); // needs "notify": one per 10 seconds
desuko.onTheme((theme) => {}); // the --ds-* design tokens are applied for you
```

- The raw messages, if you'd rather not use the helper:
  - `{ desuko: 1, type: 'ready' }` → `hello`, then `theme` messages when the theme changes.
  - `{ desuko: 1, id, call }` → `{ desuko: 1, type: 'result', id, ok, value | error }`. Calls:
    `storage.get/set/delete/keys`, `chat.draft`, `notify`.
  - Errors: `permission`, `disabled`, `quota`, `rate-limit`, `invalid`, `failed`.

A plugin can never send a message to the AI by itself (`chat.draft` only fills the box; the user
presses send), read chats, files or settings, or reach other plugins.

## Getting listed in Discover

Plugins in Discover come from [`catalog/v1/plugins.json`](catalog/v1/plugins.json). To get yours
listed, open an issue in this repository with a link to the package (a GitHub Release asset works
well) and a short description. Each entry looks like this:

```json
{
  "id": "my-notes",
  "name": "My notes",
  "description": "A note that's kept between sessions.",
  "author": "Your name",
  "version": "1.0.0",
  "homepage": "https://github.com/you/my-notes",
  "download": {
    "url": "https://github.com/you/my-notes/releases/download/v1.0.0/my-notes.desuko-plugin",
    "sha256": "…",
    "size": 12345
  }
}
```

- `id` must match the package's `plugin.json`; Desuko refuses a download that doesn't.
- `download.url` must be `https`. Desuko checks `size` (bytes) and `sha256` before showing the
  install preview, so a changed file is refused. Get both with:

```powershell
(Get-Item my-notes.desuko-plugin).Length
(Get-FileHash my-notes.desuko-plugin -Algorithm SHA256).Hash.ToLower()
```

- A new version is a new entry `version`, `url`, `size` and `sha256`. People who have the plugin
  see Update, and they review the permissions again.
