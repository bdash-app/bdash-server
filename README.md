# Bdash Server

This is a web app to share SQLs for data analysis from [Bdash](https://github.com/bdash-app/bdash).

Bdash Server is powered by [Blitz.js](https://github.com/blitz-js/blitz).

## Setup

Make `.env.local` from `.env.local.example`.

```sh
$ cp .env.local.example .env.local
```

And write your own `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for OAuth.

You can generate OAuth web client ID by following the steps described in: https://support.google.com/workspacemigrate/answer/9222992.

- Set `http://localhost:3000` as _Authorized JavaScript origins_
- Set `http://localhost:3000/api/auth/google/callback` as _Authorized redirect URIs_

## Run

```sh
$ yarn dev
```

Docker is required. 🐳

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tests

```
yarn test
```

## License

MIT
