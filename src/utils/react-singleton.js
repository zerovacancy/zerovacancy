/**
 * React Singleton Resolver
 * Ensures only one copy of React is used throughout the application
 */

// Import the original React modules directly 
import * as OriginalReact from 'node_modules/react/index.js';
import * as OriginalReactDOM from 'node_modules/react-dom/index.js';
import * as OriginalReactDOMClient from 'node_modules/react-dom/client.js';

// Create re-exports for each module
export const React = OriginalReact;
export const ReactDOM = OriginalReactDOM;
export const ReactDOMClient = OriginalReactDOMClient;

// For JSX support
export const jsxRuntime = OriginalReact.jsxRuntime;
export const jsx = OriginalReact.jsx;
export const jsxs = OriginalReact.jsxs;
export const Fragment = OriginalReact.Fragment;

// For default imports
export default React;
