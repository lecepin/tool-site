import "@/styles/globals.css";
import "@/components/JsonViewer/index.css";
import type { AppProps } from "next/app";
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyleProvider
      hashPriority="high"
      transformers={[legacyLogicalPropertiesTransformer]}
    >
      <Component {...pageProps} />
    </StyleProvider>
  );
}
