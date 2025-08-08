import { Component, PropsWithChildren } from "react";
import { ErrorPage } from "./ErrorPage";
import { ErrorUnavailableLogo } from "./Svg";
import * as Expo from "expo";
import { postHogInstance } from "../diagnostics";

export class ErrorBoundary extends Component<
  PropsWithChildren,
  { hasError: boolean; error?: unknown; info?: { componentStack?: string } }
> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: { componentStack?: string }) {
    this.setState({ ...this.state, error, info });
    console.error(error, info.componentStack);
    postHogInstance.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          title={`An error occured${(this.state.error as { message: string })?.message ? ": " + (this.state.error as { message: string }).message : ""}`}
          description={this.state.info?.componentStack || ""}
          logo={<ErrorUnavailableLogo />}
          button={{ text: "Reload", action: () => Expo.reloadAppAsync("crash") }}
        />
      );
    }

    return this.props.children;
  }
}
