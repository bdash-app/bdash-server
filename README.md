# Bdash Server

This is a web application for sharing SQL queries and data analysis results from [Bdash](https://github.com/bdash-app/bdash).

Bdash Server is powered by [Blitz.js](https://github.com/blitz-js/blitz) using [Next.js](https://nextjs.org/) and [Prisma](https://www.prisma.io/).

Related blog post: https://techlife.cookpad.com/entry/2021/06/11/120000

## Key Features

- Share SQL queries, query results, and charts from the Bdash client as a web page
- Add descriptions to your queries
- Search queries across all users

![screenshot](https://user-images.githubusercontent.com/1413408/115130638-34d03e80-a02c-11eb-905c-c96154a74d67.png)

## MCP Server

`/api/mcp` is an endpoint that provides MCP server (Streamable HTTP Transport).

It provides a tool called `search_bdash_queries` that allows keyword searching of queries.

### Authentication

Set the `Authorization` header with either:
- `Bearer <user_access_token>` - User's access token from the web interface
- `Bearer <service_key>` - Service key created with the batch script

### Service Key Management

Create a service key using the batch script:

```sh
# Generate random key
$ DATABASE_URL=mysql://... npm run task task/create_service_key.ts -- --name "my-app"

# Use specific key with expiration
$ DATABASE_URL=mysql://... npm run task task/create_service_key.ts -- --name "my-app" --key "your-key" --expires "2025-12-31"
```

Delete a service key by name:

```sh
# Delete service key
$ DATABASE_URL=mysql://... npm run task task/delete_service_key.ts -- --name "my-app"
```

### Configuration

Below is an example of Cursor's `mcp.json` configuration. You can also add this configuration using the "Add to Cursor" button in the settings screen.

<p><img width="1512" alt="mcp1" src="https://github.com/user-attachments/assets/7f904c1d-872d-450a-b3f7-c534cbe10c42" /></p>

<p><img width="587" alt="mcp2" src="https://github.com/user-attachments/assets/237783c8-de79-452d-8eb2-17f6de8d9ec2" /></p>

## Setup

### 1. Set Environment Variables

Create a local environment file by copying the example:

```sh
$ cp .env.local.example .env.local
```

### 2. Configure Google OAuth

Add your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for authentication.

You can generate OAuth web client credentials by following these steps: https://support.google.com/workspacemigrate/answer/9222992

Configure your OAuth settings:
- Set `http://localhost:3000` as _Authorized JavaScript origins_
- Set `http://localhost:3000/api/auth/google/callback` as _Authorized redirect URIs_

### 3. Setup Local Database

Start the Docker containers:

```sh
$ docker compose -f docker-compose-dev.yml up
```

Create databases using Prisma:

```sh
$ yarn db:push
```

## Development

Start the Docker containers:

```sh
$ docker compose -f docker-compose-dev.yml up
```

Start the development server:

```sh
$ yarn dev
```

## License

MIT
