# Stress-O-Scope

Stress-O-Scope is a web application designed to help users gain insights into their stress levels and patterns through a series of interactive games. The application is built with Next.js and React, utilizing Tailwind CSS for styling. It aims to provide a privacy-friendly experience, with AI-powered analysis performed via the Groq API (though actual data collection and API integration will be implemented in later stages).

## Project Goals

-   Develop an MVP (Minimum Viable Product) of the Stress-O-Scope application.
-   Implement three distinct interactive games to gather user interaction data.
-   Utilize React Context for state management across the application.
-   Integrate with the Groq API for AI-driven analysis of game results.
-   Ensure a responsive, mobile-first design with a cosmic theme.
-   Prioritize user privacy by not persisting sensitive data.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18.x or later recommended)
-   npm (usually comes with Node.js)

### Installation & Setup

1.  **Clone the repository (or set up the project if you are Jules!):**
    ```bash
    # git clone <repository-url>
    # cd stress-o-scope
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root of the project (`stress-o-scope/`) for any environment variables. For later stages, this will include:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```
    For now, this file can be left empty or not created.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts a production server (after building).
-   `npm run lint`: Lints the codebase using ESLint.

## Project Structure

-   `src/app/`: Main application pages and layouts (App Router).
-   `src/components/`: Reusable React components.
    -   `src/components/games/`: Components for each interactive game.
    -   `src/components/ui/`: General UI elements (buttons, layout, etc.).
    -   `src/components/results/`: Components for displaying analysis results.
-   `src/context/`: React Context for global state management.
-   `src/utils/`: Utility functions and helpers.
-   `src/styles/`: Global styles and Tailwind CSS configuration (`globals.css` is in `src/app/`).
-   `public/`: Static assets.

## Technology Stack

-   Next.js (React Framework)
-   React
-   TypeScript
-   Tailwind CSS
-   Axios (for API calls)
-   Groq API (for AI analysis - to be implemented)

## Contributing

Please refer to the project's contributing guidelines if available (to be created).

---

This README provides a basic overview and setup instructions for the Stress-O-Scope project. Further details will be added as development progresses.
