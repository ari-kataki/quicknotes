# 01 - first version (Nov 2025)

My first React Native app with a PHP backend.

- `app`: Expo app with a login screen and a notes screen (`component/`)
- `api`: PHP API (`login.php`, `notes.php`, `create_note.php`, `delete_notes.php`), tokens made in `functions.php`

Copy `api/config.example.php` to `api/config.php` before using the API. In `app/component/Login_Screen.js` and `Notes_Screen.js` the server address is `YOUR_PC_IP`: replace it with your computer's local IP.

It is a work in progress and has a few known bugs (wrong joins in the notes query, mismatched parameter names in delete, missing `http://` in the delete URL). They are one of the reasons for the rewrite in `02-rewrite`.
