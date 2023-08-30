# Bdash Server

This is a web app to share SQLs for data analysis from [Bdash](https://github.com/bdash-app/bdash).

The features are:
1. Share as a web page your SQL, query results and charts from Bdash client.
1. Add descriptions to your query.
1. Search queries of all users.

![screenshot](https://user-images.githubusercontent.com/1413408/115130638-34d03e80-a02c-11eb-905c-c96154a74d67.png)

Bdash Server is powered by [Blitz.js](https://github.com/blitz-js/blitz) using [Next.js](https://nextjs.org/) and [Prisma](https://www.prisma.io/).

## Setup

Make your own `.env.local` from `.env.local.example` for development.

```sh
$ cp .env.local.example .env.local
```

And write your own `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for OAuth.

You can generate OAuth web client ID by following the steps described in: https://support.google.com/workspacemigrate/answer/9222992.

After that,
- Set `http://localhost:3000` as _Authorized JavaScript origins_
- Set `http://localhost:3000/api/auth/google/callback` as _Authorized redirect URIs_

## Run

```sh
$ yarn dev
```

Docker is required. 🐳

Run db:migrate to setup database.

```sh
$ yarn db:migrate
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run production mode (NODE_ENV=production) on local machine

Run an app container with the image built by [Dockerfile](https://github.com/morishin/bdash-server/blob/main/Dockerfile) for production.

```sh
docker compose -f docker-compose-with-app-container.yml up --build
```

## Tests

```
yarn test
```

## License

MIT
