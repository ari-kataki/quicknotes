# QuickNotes

A small notes app: an Expo / React Native app that talks to a PHP + MySQL API with token login. I built it twice, about a year apart, so the repo keeps both versions to show how much changed.

| Folder | What it is | When | What I was learning |
|---|---|---|---|
| `00-prototypes` | Message board client (login, list, write, delete) made before the first version, only the app | Nov 2025 | `useState` pages without navigation, axios, bearer token, `ScrollView` |
| `01-first-version` | First try. Login screen + notes screen, small PHP API (`api_QuickNotes`) | Nov 2025 | React Native basics, axios, useState/useEffect, PHP + PDO, a first token (HMAC) |
| `02-rewrite` | Rewrite of the app and the API: register/login, secure token storage, create/edit/delete notes, pagination | Oct 2026 | splitting the app into screens and ui components, validating input, tokens with expiry, soft delete |

`01` and `02` have an `app` (Expo) and an `api` (PHP). `00-prototypes` only has the app, its API is not in this repo.

## The progression

The first version works as a demo but is rough. It reuses the table names of another exercise (`bacheca`), the notes query joins the wrong columns, the delete query has mismatched parameter names, and the delete URL in the app is missing `http://`. The notes only have a text (no title), there is no register, and the token is kept in memory only.

The rewrite fixes all of that: new database (`quicknotes`, see `02-rewrite/database/quicknotes.sql`), one `api.php` with the shared helpers (JSON responses, bearer token, validation, "is this note mine?"), a `TokenManager` class, register + login, `expo-secure-store` for the token, notes with title and content, edit, delete, and loading more notes when you scroll.

I left the first version as it was (bugs included) because it is the starting point. `00-prototypes` is the step before that: a message board app that is not QuickNotes yet, kept as it was.

## Stack

- Expo / React Native, axios
- PHP (PDO, prepared statements), MySQL
- Tested with MAMP

## How to run

API (both versions):

1. Put the `api` folder in your MAMP `htdocs` (for the rewrite, inside `htdocs/QuickNotes/QuickNotesApi` to match the URLs in `app/config.js`, or change the URL there).
2. Copy `config.example.php` to `config.php` and fill in your DB password and a secret of your own.
3. Create the database. For the rewrite import `02-rewrite/database/quicknotes.sql`. The first version has no SQL file in the repo (it used the tables of the `bacheca` exercise).

App:

1. `cd` into the `app` folder and run `npm install`
2. Replace `YOUR_PC_IP` with your computer's IP in `config.js` (rewrite) or in the screens (first version, `SERVER_URL` and the URLs in `Notes_Screen.js`). Use your computer's local IP, not `localhost`, if you test on a phone.
3. `npx expo start`

## Known issues

- The server address in the app is a placeholder, `YOUR_PC_IP`, in `02-rewrite/app/config.js`, in the first version's screens (`Login_Screen.js`, `Notes_Screen.js`) and in the prototype's screens (`00-prototypes/messages-board-app/components/screens`). Replace it with your computer's local IP (and the port you use) before running.
- The first version has the bugs listed above on purpose, it is not meant to work end to end.
- The tokens are a home-made HMAC token, not a real JWT library. Good enough to learn how they work, not something to put in production.
- The rewrite sends everything over plain `http`, so no HTTPS.
- The first version shows the database error message in its JSON responses (`Errore DB: ...`), which can reveal details about the server. The rewrite logs the error and sends a generic message.
- The API config (`config.php`, with the DB password and token secret) is not in the repo, only `config.example.php`. Put your own values in it.
