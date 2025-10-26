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

## Documentation

- [DESIGN.md](DESIGN.md) - Design philosophy and key features
- [CLAUDE.md](CLAUDE.md) - Development guide for Claude Code
