# Hospital Finder

A modern, responsive web application for finding and comparing hospitals across different states. Built with Angular and styled with Tailwind CSS.

## Features

- Search and filter hospitals by state, services, type, and delivery cost range
- View hospitals grouped by state
- View detailed hospital information including location, services, delivery costs, and contact details
- Submit new hospital entries through a public form
- Add comments to hospital detail pages
- Responsive design that works on mobile, tablet, and desktop devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- NPM (v8 or higher)

### Environment Configuration
This project uses environment-specific configuration. See [ENVIRONMENT.md](ENVIRONMENT.md) for details.

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### API Configuration

The application is configured to work with a backend API. Update the `proxy.conf.js` file with the correct API URL if needed.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
