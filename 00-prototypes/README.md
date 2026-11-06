# 00 - prototypes

An Expo app I made a few days before the first version of QuickNotes (Oct 31 - Nov 11 2025). It is a small message board client: log in, see the messages, write a message, delete your own.

Folder `messages-board-app`:
- `App.js`: keeps the page (`Login` or `Messages`) and the user data in `useState`, no navigation library.
- `components/screens/LoginScreen.js`: login with `axios.post`, then loads the messages and goes to the next page.
- `components/screens/MessagesScreen.js`: list of messages, form to write one, delete button on your own messages.
- `components/ui/Message.js`: one message.

The Expo project is called `WCourse` in `app.json` / `package.json`, that was the name I gave the project.

Stack: Expo / React Native, axios.

How to run: `npm install`, replace `YOUR_PC_IP` in `LoginScreen.js` and `MessagesScreen.js` with your computer's IP, `npx expo start`. The app needs its own API (`/API/login.php`, `messages.php`, `create_message.php`, `delete_message.php` on port 8888), which is not in this repo, so it does not work on its own.

Known issues: the server URL is repeated in four places, the messages are loaded twice (after login and again in the messages screen), and errors are only logged to the console. Everything goes over plain `http`.

The other copies of the Expo folders from that time (`NomeApp` and two copies of `QuickNotes`) are not here: one is the empty Expo template and the others are the same as `01-first-version`.
