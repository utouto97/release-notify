# release-notify-front

## Getting Started

```sh
docker compose build
docker compose up -d
```

Visit `localhost:3000`.

## Running the tests

### lint & format

```sh
docker compose exec front npm run lint
docker compose exec front npm run format
```

## Deployment

With GitHub Actions and GitHub Pages.

See `../.github/workflows/`.
