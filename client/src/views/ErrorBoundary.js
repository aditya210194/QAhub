import React, { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state to display fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to an external service (optional)
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "20px", backgroundColor: "#f2dede", color: "#a94442" }}>
                    <h2>Something went wrong with the text editor.</h2>
                    <p>{this.state.error ? this.state.error.message : "Unexpected Error"}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
