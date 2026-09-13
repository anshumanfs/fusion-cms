![Alt text](./public/logo/dark/icons8-react-native-128.svg 'Fusion CMS')

Fusion CMS is an open-source headless CMS and API builder for teams that want to ship database-backed APIs quickly. It provides a dashboard for onboarding data sources, defining schemas, managing users, and exposing generated GraphQL/REST endpoints.

## Beta Features

- Next.js dashboard with authentication, users, schemas, databases, and access control screens.
- Express/Apollo backend for Fusion CMS management APIs.
- Metadata storage through MongoDB, MySQL/PostgreSQL-compatible Sequelize connectors, or SQLite.
- Generated API templates for MongoDB and MySQL-backed applications.
- GraphQL-first generated APIs with REST support through Sofa.
- Centralized application build/run orchestration.

## Requirements

- Node.js 18 or newer.
- npm 9 or newer.
- Git.
- Optional: MongoDB, MySQL, PostgreSQL, SQLite, MariaDB, MSSQL, Oracle, or DB2 depending on the databases you want to connect.

## Quick Start

```bash
npm install
cp .env.example .env
cp .secure.example.json .secure.json
npm run dev
```

Open `http://127.0.0.1:3001` after the server starts.

By default, the example secure config uses SQLite for Fusion CMS metadata at `.temp/fusion-cms-metadata.sqlite`, so a fresh beta install does not need an external metadata database.

## Configuration

- `.env` controls runtime options such as `PORT`, `APP_MODE`, `GRAPHQL_MODULE`, and Sequelize logging.
- `.secure.json` stores private configuration such as SMTP credentials and the metadata database connection. This file is intentionally ignored by git.
- `.secure.example.json` is safe to commit and documents the expected shape.

For production, replace `CIPHER_KEY` and every value in `config.json > secrets` before exposing the app publicly. Values that start with `dev-only-change-me-` are accepted only for local development; production-like environments refuse to start with those defaults.

## Scripts

```bash
npm run dev          # build server TS and run the integrated app with nodemon
npm run build        # build Next.js and the server
npm run start        # run the compiled server
npm test             # run template/unit tests
npm run typecheck    # run app and server TypeScript checks
npm run beta:check   # run typecheck, tests, and production build
```

## Beta Release Checklist

Run these before publishing a beta build:

```bash
npm test -- --runInBand
npm run build
```

Or run the combined check:

```bash
npm run beta:check
```

The docs app lives in `../fusion-cms-docs`, and the CLI package lives in `../fusion-cms-cli`.
