# PWA Frontend

## Project Description
This is a Progressive Web App (PWA) project developed with Angular 17, allowing users to access the application both online and offline. The application implements advanced synchronization and local storage strategies to ensure a seamless experience regardless of connectivity conditions.

## Prerequisites
- Node.js (version 18.x or higher)
- Angular CLI (version 17.x)
- npm (included with Node.js)

## Installation

1. Clone the repository:
bash
git clone https://github.com/jefer15/pwa-frontend.git
cd pwa-frontend

2. Install dependencies:
npm install

## Project Structure

src/
├── app/ # Application home directory
│ ├── auth/ # Authentication module
│ ├── components/ # Reusable components
│ ├── interceptor/ # HTTP interceptors
│ ├── layout/ # Layout and layout components
│ ├── models/ # Interfaces and Types
│ ├── pages/ # Page Components
│ ├── services/ # Services and Business Logic
│ ├── app.component.* # Root Component
│ ├── app.config.ts # Application Configuration
│ └── app.routes.ts # Route Configuration
├── assets/ # Static Resources (images, fonts, etc.)
├── environments/ # Per-Environment Configuration
├── index.html # HTML Entry Point
├── main.ts # Application Entry Point
├── manifest.webmanifest # PWA Configuration
└── styles.scss # Styles global

### Directories Description

- *auth/*: Contains authentication and authorization logic
- *components/*: Reusable components throughout the application
- *interceptor/*: HTTP interceptors for error handling and request transformation
- *layout/*: Structure components such as header, footer, and sidebar
- *models/*: TypeScript interfaces and types
- *pages/*: Main components for each page/route
- *services/*: Services for business logic and communication with APIs
- *environments/*: Environment-specific configurations (development, production)

## Available Commands

- Start the development server:
npm start

- Build the project:
npm run build

- Run tests:
npm test

## Testing the Production Build

To test the production version locally:

1. First, build the project:
npm run build

2. Install http-server Globally (if not installed):
npm install -g http-server

3. Serve the application:
http-server -p 8080 -c-1 dist/pwa-frontend/browser

## Online/Offline Functionality

The application is designed to work in both modes:

### Online Mode
- Full access to all features
- Automatic data synchronization
- Updating cached resources

### Offline Mode
- Access to previously stored data
- Maintained basic functionality
- Automatic synchronization when the connection is restored

## Technologies Used

### Frontend
- *Angular 17*: Main framework for application development
- *Angular Material*: Predefined and styled UI components
- *TailwindCSS*: CSS framework for custom styles
- *RxJS*: Handles reactive programming and observables
- *@angular/service-worker*: Service implementation Workers for PWA functionality
- *SweetAlert2*: Library for interactive alerts and notifications

### Storage and Synchronization
- *IndexedDB (idb)*: Client-side database for persistent storage
- *Service Workers*: For caching and offline functionality
- *Local Storage*: Storing configuration and preference data

## Technical Implementation

### Local Storage
- Using IndexedDB for structured data storage
- Implementing caching strategies for static resources
- Managing storage quotas and automatic cleanup

### Online/Offline Synchronization
- Implementing synchronization queues for pending operations
- Automatic retry policies for failed operations
- Handling conflicts in data synchronization

### Error Handling
- HTTP interceptors for centralized error handling
- Logging system for error tracking
- Automatic recovery from network failures

### Retry Policies
- Retries Exponentials for failed operations
- Configurable retry limits per operation type
- User notifications about operation status

## Relevant Technical Details

### Service Worker
- Automatic registration and updating
- Caching strategies for different resource types
- Handling application updates