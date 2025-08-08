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
