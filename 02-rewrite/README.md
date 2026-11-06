# 02 - rewrite (Oct 2026)

Same idea as the first version, redone from scratch.

- `app`: Expo app with `screens/` (login, register, home) and `ui/` (form, note, feed). The token is saved with `expo-secure-store` (localStorage on web).
- `api`: PHP API with register, login, list (paginated), create, edit and delete (soft delete).
- `database/quicknotes.sql`: tables `users` and `notes`.

Copy `api/config.example.php` to `api/config.php` and fill in your DB password and token secret.

In `app/config.js` replace `YOUR_PC_IP` with your computer's local IP.
