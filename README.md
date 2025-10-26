# GitHub Repository Search App

This project is a simple web application for searching GitHub repositories and viewing their detailed information.

## Features

- **Repository Search**: The app uses the GitHub API to search for repositories.
- **Detail Page**: From the search results, you can view detailed information for any repository, such as stars, watchers, and forks.
- **Pagination**: If there are many search results, you can navigate through the pages.
- **Theme Toggle**: The display can be switched between light and dark modes.
- **Error Handling**: A 404 page is displayed when a non-existent repository is accessed.

## Technologies Used

- **Next.js**: A React framework.
- **TypeScript**: A type-safe superset of JavaScript.
- **Tailwind CSS**: A utility-first CSS framework.
- **shadcn/ui**: A collection of reusable UI components based on Radix UI and Tailwind CSS.
- **Lucide React**: An icon library.
- **Storybook**: A frontend workshop for building and documenting UI components in isolation.

## Development Setup

To run the project locally, follow these steps:

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/shohata/GitHubRepoSearchApp.git
    cd GitHubRepoSearchApp
    ```

2.  **Install dependencies**:
    This project uses pnpm.

    ```bash
    pnpm install
    ```

3.  **Start the development server**:

    ```bash
    pnpm dev
    ```

You can now access the application at `http://localhost:3000`.

## Environment Setup

This application uses the GitHub API. Unauthenticated requests have a strict rate limit, so setting up a **GitHub Personal Access Token (PAT)** is recommended for a smooth development experience.

1.  Follow [this guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) to create a Personal Access Token with repository read permissions.
2.  Create a file named `.env.local` in the project's root directory.
3.  In the created file, set the token you obtained as follows:

    ```
    GITHUB_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
    ```

4.  Restart the development server.

This will significantly relax the API rate limit, allowing you to send more requests. The `.env.local` file is included in `.gitignore`, so it will not be committed to the Git repository.

## Testing

This project uses Jest, Testing Library, and Playwright for comprehensive testing.

### Unit Tests (Jest)

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests in UI mode
pnpm test:e2e:ui

# Run E2E tests in debug mode
pnpm test:e2e:debug
```

### Test File Locations

- Unit tests: `__tests__/**/*.test.ts(x)`
- E2E tests: `e2e/**/*.spec.ts`

### Initial Setup

Install Playwright browsers:

```bash
pnpm exec playwright install
```

For more details, see [CLAUDE.md](CLAUDE.md).

## Storybook

This project uses Storybook for component development and documentation.

### Running Storybook

```bash
# Start Storybook development server
pnpm storybook
```

Access Storybook at `http://localhost:6006`.

### Building Storybook

```bash
# Build static Storybook site
pnpm build-storybook
```

### Available Stories

- **UI Components**: Button, Input, Card, ErrorDisplay, Spinner
- **Feature Components**: RepoStatCard, SearchForm

Storybook provides:
- Interactive component playground
- Auto-generated documentation
- Accessibility testing (a11y addon)
- Visual testing capabilities
- Component catalog for the design system

## Docker

This project supports Docker for easy deployment and consistent development environments.

### Production Build

Build and run the application using Docker:

```bash
# Build the Docker image
docker build -t github-repo-search-app .

# Run the container
docker run -p 3000:3000 github-repo-search-app
```

Or use Docker Compose:

```bash
# Build and run
docker-compose up -d

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:3000`.

### Development Environment

To run the development server in Docker:

```bash
# Start the development container
docker-compose --profile dev up dev

# Stop the development container
docker-compose --profile dev down
```

The development server will be available at `http://localhost:3001` with hot reload enabled.

### Docker Files

- `Dockerfile` - Multi-stage production build optimized for size and security
- `Dockerfile.dev` - Development environment with hot reload
- `docker-compose.yml` - Orchestration for both production and development
- `.dockerignore` - Files to exclude from Docker builds

## Documentation

- [DESIGN.md](DESIGN.md) - Design philosophy and key features
- [CLAUDE.md](CLAUDE.md) - Development guide for Claude Code
