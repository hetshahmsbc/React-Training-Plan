/// <reference types="vite/client" />

// The @msbc packages ship their own types, but declaring the CSS side-effect
// import keeps TypeScript happy if a type is ever missing.
declare module '@msbc/react-toolkit/dist/index.css';
