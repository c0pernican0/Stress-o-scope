# Stress-O-Scope

Stress-O-Scope is an interactive web application designed to help users gain insights into their stress levels and behavioral patterns through a series of three engaging cosmic-themed games. Built with Next.js (App Router), React, and TypeScript, and styled with Tailwind CSS, it provides a privacy-friendly experience. AI-powered analysis of game interactions is performed via the Groq API, with a fallback system for continuous availability.

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
-   `npm test`: Runs the test suite (after setup).

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

## Testing

This project uses Jest and React Testing Library for unit and component testing. Example tests are located in the `src/__tests__` directory.

### Test Setup

1.  **Install dev dependencies:**
    If you haven't already, or if setting up fresh, you might need to install Jest, React Testing Library, and related packages:
    ```bash
    npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest ts-jest identity-obj-proxy
    ```
    *(Note: `ts-jest` is for TypeScript projects, `identity-obj-proxy` is for mocking CSS modules if you use them).*

2.  **Configure Jest:**
    Create a `jest.config.js` (or `jest.config.ts`) file in the root of your `stress-o-scope` project:

    ```javascript
    // jest.config.js
    const nextJest = require('next/jest');

    const createJestConfig = nextJest({
      // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
      dir: './',
    });

    // Add any custom config to be passed to Jest
    /** @type {import('jest').Config} */
    const customJestConfig = {
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // if you have a setup file
      testEnvironment: 'jest-environment-jsdom',
      moduleNameMapper: {
        // Handle module aliases (if you are using them in your tsconfig.json)
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/context/(.*)$': '<rootDir>/src/context/$1',
        '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
        // Mock CSS Modules (if you use them)
        // '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
      preset: 'ts-jest', // if using TypeScript with ts-jest
    };

    // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
    module.exports = createJestConfig(customJestConfig);
    ```

    Create a `jest.setup.js` file in the root (`stress-o-scope/`) for global test setup (e.g., importing jest-dom matchers):
    ```javascript
    // jest.setup.js
    import '@testing-library/jest-dom';
    ```

    If using `ts-jest`, your `tsconfig.json` might need to include `"jest"` in `types` under `compilerOptions` for global Jest types. E.g.:
    ```json
    {
      "compilerOptions": {
        // ... other options
        "types": ["jest", "node"] // Add "jest"
      }
      // ...
    }
    ```


3.  **Update `package.json` scripts:**
    Ensure your `package.json` has a test script:
    ```json
    "scripts": {
      // ... other scripts
      "test": "jest",
      "test:watch": "jest --watch"
    },
    ```

### Running Tests

To run all tests:
```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

Example tests provided:
-   `src/__tests__/utils/analysisEngine.test.ts`: Unit tests for the fallback analysis logic.
-   `src/__tests__/components/Button.test.tsx`: Component tests for the UI Button.

### Mocking API Calls
When testing components that make API calls (like `GameContext.tsx` eventually might, or pages that trigger analysis), you'll want to mock `fetch` or `axios`. With Jest, you can do this globally in `jest.setup.js` or per-test file.

Example (conceptual, for `fetch`):
```javascript
// In your test file or jest.setup.js
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ mockData: 'someValue' }),
  })
);

// Before each test if you need to clear mocks
beforeEach(() => {
  fetch.mockClear();
});
```
This setup provides a starting point for testing the application.

## Performance Optimization

### Bundle Analysis
To analyze the JavaScript bundle sizes and identify potential areas for optimization, you can use the `@next/bundle-analyzer` package.

1.  **Install the package:**
    ```bash
    npm install --save-dev @next/bundle-analyzer
    # or
    # yarn add --dev @next/bundle-analyzer
    ```

2.  **Configure `next.config.js` (or `next.config.ts`):**
    ```javascript
    // next.config.js or next.config.ts
    const withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: process.env.ANALYZE === 'true',
    });

    module.exports = withBundleAnalyzer({
      // Your Next.js config
      reactStrictMode: true,
    });
    ```

3.  **Run the analyzer:**
    ```bash
    ANALYZE=true npm run build
    ```
    This will open HTML reports in your browser showing the bundle composition.

### Lighthouse Scores
Aim for high Lighthouse scores across Performance, Accessibility, Best Practices, and SEO. After deploying your application (even to a preview environment on Vercel), run Lighthouse audits using Chrome DevTools. Address any issues or opportunities for improvement identified by the audit. Common areas include optimizing images (though this app is light on images), reducing JavaScript execution time, ensuring accessible color contrasts, and proper ARIA attributes.

### Code-Level Optimizations
- **`React.memo`, `useCallback`, `useMemo`**: These React APIs have been used in various parts of the application to prevent unnecessary re-renders and re-computations. Continue to apply them judiciously, especially in components that are part of frequently updated UIs or have expensive rendering logic.
- **Code Splitting**: Next.js (App Router) automatically handles code splitting at the route level. Game components are loaded as part of their respective page chunks.
- **Tailwind CSS Purging**: Unused Tailwind CSS styles are automatically purged in production builds, thanks to the configuration in `tailwind.config.ts`.

## Deployment

This Stress-O-Scope application is optimized for deployment on Vercel.

### Deploying to Vercel

1.  **Sign up/Log in to Vercel:**
    Go to [vercel.com](https://vercel.com/) and create an account or log in.

2.  **Import Project:**
    - Click "Add New..." -> "Project".
    - Import your Git repository (e.g., from GitHub, GitLab, Bitbucket). Vercel will automatically detect that it's a Next.js project.

3.  **Configure Project:**
    - **Framework Preset:** Should be automatically set to "Next.js".
    - **Build & Output Settings:** Usually, Vercel's defaults are sufficient.
    - **Environment Variables:** This is crucial.
        - Add your Groq API Key:
            - **Name:** `GROQ_API_KEY`
            - **Value:** Paste your actual Groq API key here (the one from your `.env.local` or your secure store).
        - Ensure you select the environments (Production, Preview, Development) where this variable should be available. For `GROQ_API_KEY`, it's typically needed in Production and Preview, and can also be set for Development if you use Vercel's dev environment.

4.  **Deploy:**
    - Click the "Deploy" button. Vercel will build and deploy your application.
    - Once deployed, you'll get a URL for your live application (e.g., `your-project-name.vercel.app`).

### `vercel.json`
A basic `vercel.json` file has been included in the project. For most Next.js projects, Vercel's automatic configuration is excellent. This file can be used for more advanced configurations such as custom headers, redirects, or build overrides. The example includes:
-   Specifying the Next.js build preset (`@vercel/next`).
-   An example of how environment variables can be referenced (using `@groq_api_key` which means Vercel will prompt you to link a secret or you define it in project settings). It's generally recommended to set sensitive environment variables directly in the Vercel project settings UI for better security and management.
-   Basic security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`). More complex headers like `Content-Security-Policy` are often better managed via `next.config.js` for Next.js applications.

### Custom Domain
After deployment, you can assign a custom domain to your Vercel project through the Vercel dashboard settings.

## Security Considerations

While this application is designed with privacy in mind (no user accounts or persistent PII storage beyond session game state), here are some security points:

-   **API Key Management**: The `GROQ_API_KEY` is managed via `.env.local` (gitignored) for local development and as an environment variable in Vercel for deployment. This is standard practice to keep keys out of frontend code.
-   **Input Validation**: The `/api/analyze` endpoint receives structured JSON from the client. Basic validation checks for the presence of required game result objects.
-   **Output Encoding**: AI-generated text (recommendations, horoscope, etc.) is rendered as text content by React, which mitigates XSS risks from this source.
-   **Rate Limiting (Enhancement)**: The `/api/analyze` endpoint currently does not have rate limiting. For a production application, especially one calling external AI services, implementing rate limiting (e.g., using Vercel's built-in features or a library like `rate-limiter-flexible`) is highly recommended to prevent abuse and manage costs.
-   **Content Security Policy (CSP) (Enhancement)**: CSP headers can further enhance security by restricting the sources from which resources (scripts, styles, etc.) can be loaded. A basic CSP can be configured in `next.config.js` or `vercel.json`. See `next.config.ts` for an example.
-   **HTTPS**: Deployment on Vercel automatically includes HTTPS.

Always conduct thorough security testing and reviews before deploying any application to production with real user data or external service integrations.

## Architecture Overview

The Stress-O-Scope application is built using Next.js with the App Router, TypeScript, and Tailwind CSS.

-   **Frontend Structure (`src/` directory):**
    -   `app/`: Contains all UI and routing logic using Next.js App Router conventions.
        -   `layout.tsx`: The root layout, wraps all pages with global providers (`GameProvider`) and the main UI `Layout`.
        -   `page.tsx`: The main landing page.
        -   `game/page.tsx`: Dynamically renders the current game (Intro, CosmicCalm, StellarMemory, NarrativeWaves) based on context state.
        -   `results/page.tsx`: Displays the analysis results.
        -   `api/analyze/route.ts`: Serverless function endpoint for handling AI analysis requests via Groq API.
    -   `components/`: Contains reusable React components.
        -   `ui/`: Basic UI elements like `Button`, `Layout`, `ProgressBar`, `LoadingSpinner`.
        -   `games/`: Individual game components (`IntroInstructions`, `CosmicCalm`, `StellarMemory`, `NarrativeWaves`).
        -   `results/`: Components for displaying results (`StressProfile`, `Recommendations`, `CosmicHoroscope`, `GamePerformanceSummary`, `ResultsSummary`).
    -   `context/`: Contains `GameContext.tsx` for global state management (current game, game results, analysis data, session state) using React Context and `useReducer`. Also includes `GameTypes.ts` for shared type definitions.
    -   `utils/`: Utility functions, currently includes `analysisEngine.ts` for fallback analysis logic.
    -   `styles/`: (Currently contains only `.gitkeep`). `globals.css` in `src/app/` handles global styles and Tailwind directives.
-   **State Management:**
    -   `GameContext` is the central store for application state, managing game progression, results from each game, and the final AI analysis.
    -   Session storage is used to persist game state across page refreshes within a single browser session.
-   **AI Analysis:**
    -   Game results are sent to a Next.js API route (`/api/analyze`).
    -   This API route constructs a detailed prompt and queries the Groq API (mixtral-8x7b-32768 model).
    -   A fallback mechanism using simple heuristics in `utils/analysisEngine.ts` provides results if the Groq API call fails.
-   **Styling:**
    -   Tailwind CSS is used for all styling, configured with a custom "cosmic" theme.
-   **Deployment:**
    -   Optimized for Vercel, using environment variables for API keys.

This architecture aims for a separation of concerns, reusability of components, and a clear data flow from game interaction to AI analysis and results display.

## Final QA Checklist (Manual Testing Guide for User)

Before considering the application production-ready, please perform the following checks:

**1. Core Application Flow:**
    - [ ] **Landing Page:** Loads correctly (`/`). "Inizia il Test" button navigates to `/game`.
    - [ ] **Game Progression:**
        - [ ] Intro/Instructions screen appears first on `/game`.
        - [ ] Clicking "Begin" on Intro screen starts Cosmic Calm. ProgressBar updates.
        - [ ] **Cosmic Calm:**
            - [ ] Element selection works.
            - [ ] Constellation drawing works (5-7 points).
            - [ ] All 5 questions can be answered.
            - [ ] Game completes and automatically transitions to Stellar Memory. ProgressBar updates.
        - [ ] **Stellar Memory:**
            - [ ] Game starts, sequence plays.
            - [ ] User input is correctly registered.
            - [ ] Correct sequence advances level. Difficulty increases (speed, opacity, length).
            - [ ] Incorrect sequence deducts a life and replays/resets.
            - [ ] Breathing circle animates. (Mouse tracking for sync rate is harder to visually QA but check for console errors).
            - [ ] Game Over screen appears after 3 errors.
            - [ ] Game completes (after Game Over) and automatically transitions to Narrative Waves. ProgressBar updates.
        - [ ] **Narrative Waves:**
            - [ ] All 6 story segments display correctly with their options.
            - [ ] Choices can be made for each segment.
            - [ ] Game completes and automatically transitions to results analysis. ProgressBar updates.
    - [ ] **Analysis & Results Page (`/results`):**
        - [ ] Loading spinner appears while analysis is fetched (if `currentGame === 4` and `analysisLoading` is true on `/game` or on initial load of `/results`).
        - [ ] Results display correctly: Stress Profile (gauge, areas), Recommendations, Cosmic Horoscope, Game Performance Summary.
        - [ ] "Take Test Again" button resets the session (clears `sessionStorage`) and navigates to the landing page (`/`).

**2. Functionality & Data:**
    - [ ] **Session Persistence:** Refreshing the page during any game (e.g., on `/game` at `currentGame = 2`) should resume at the same game and step (or as close as state allows). Game results collected so far should persist.
    - [ ] **API & Fallback:**
        - [ ] (With valid API key) Verify AI analysis is received and displayed. Check `X-Analysis-Source: AI` header in network tools for `/api/analyze` response.
        - [ ] (Test Fallback - e.g., by temporarily invalidating API key in `.env.local` and restarting dev server) Verify fallback analysis is displayed if AI call fails. Check `X-Analysis-Source: Fallback-...` header.
    - [ ] **Error Handling:**
        - [ ] If API call fails during analysis, an error message should be shown on the results page, or the fallback should engage.
        - [ ] Attempting to navigate to `/results` directly before completing games should redirect to `/game` or `/`.

**3. UI/UX & Responsiveness:**
    - [ ] **Visuals:** All UI elements render correctly, cosmic theme is consistent.
    - [ ] **Responsiveness:** Test on different screen sizes (desktop, tablet, mobile).
        - [ ] Layouts adapt correctly.
        - [ ] Text is readable.
        - [ ] Buttons and interactive elements are easily tappable/clickable.
    - [ ] **Animations:** All planned animations (fade-ins, gauge, typewriter, breathing circle) work smoothly.
    - [ ] **ProgressBar:** Accurately reflects the current stage of the application.

**4. Accessibility (Visual Checks & Keyboard):**
    - [ ] **Keyboard Navigation:** All interactive elements (buttons, links, game choices) are reachable and operable using the keyboard. Focus indicators are visible.
    - [ ] **ARIA Labels:** Spot-check elements that should have ARIA labels (e.g., icon buttons) using browser dev tools.
    - [ ] **Color Contrast:** Perform a visual check for text readability. (Automated tools like Axe DevTools browser extension can provide a more detailed audit).

**5. Browser Compatibility:**
    - [ ] Test the application in the latest versions of major browsers (Chrome, Firefox, Safari, Edge).

**6. Console Checks:**
    - [ ] Open browser developer console. Check for any errors or critical warnings during navigation and gameplay.

This checklist provides a good baseline for manual QA. Depending on the desired level of polish, further detailed test cases can be developed.
