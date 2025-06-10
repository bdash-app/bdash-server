# Bdash Server

This is a web application for sharing SQL queries and data analysis results from [Bdash](https://github.com/bdash-app/bdash).

## Key Features

- Share SQL queries, query results, and charts from the Bdash client as a web page
- Add descriptions to your queries
- Search queries across all users

![screenshot](https://user-images.githubusercontent.com/1413408/115130638-34d03e80-a02c-11eb-905c-c96154a74d67.png)

Bdash Server is powered by [Blitz.js](https://github.com/blitz-js/blitz) using [Next.js](https://nextjs.org/) and [Prisma](https://www.prisma.io/).

## Setup

### Set Environment Variables

Create a local environment file by copying the example:

```sh
$ cp .env.local.example .env.local
```

### Configure Google OAuth

Add your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for authentication.

You can generate OAuth web client credentials by following these steps: https://support.google.com/workspacemigrate/answer/9222992

Configure your OAuth settings:
- Set `http://localhost:3000` as _Authorized JavaScript origins_
- Set `http://localhost:3000/api/auth/google/callback` as _Authorized redirect URIs_

### Setup Local Database

Start the Docker containers:

```sh
$ docker compose -f docker-compose-dev.yml up
```

Create databases using Prisma:

```sh
$ yarn db:push
```

## Development

Start the development server:

```sh
$ yarn dev
```

## Production Deployment

Run the app container using the production Dockerfile:

```sh
$ docker compose -f docker-compose-with-app-container.yml up --build
```

## License

MIT
