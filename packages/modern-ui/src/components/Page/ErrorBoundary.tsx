import React, { Component } from 'react';

export default class ErrorBoundary extends Component<{}, { error?: any }> {
  state = { error: null };

  componentDidCatch(error: any) {
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return (
        <pre>
          Error - {`${this.state.error}`}
        </pre>
      );
    }
    return this.props.children;
  }
}
