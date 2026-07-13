// ErrorBoundary.tsx — Day 8 ERROR BOUNDARIES.
// A class component that catches render errors and shows a fallback screen.
// Fill this in from the guide in chat.

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundry extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  // Called when a child throws - return the new state to show the fellback.
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  // Called after an error - a good place to log it.
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundry caught: ", error, info);
  }
  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundry">
          <div className="error-boundry-card">
            <div style={{ fontSize: "2.5rem" }}>💥</div>
            <h1>Something Broke</h1>
            <p>{this.state.message || "An unexpected error happened."}</p>
            <button className="error-boundry-btn" onClick={this.handleReset}>
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
