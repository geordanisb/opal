import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <script src="https://d3js.org/d3.v7.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/vega@5.22.1"></script>
        <script src="https://cdn.jsdelivr.net/npm/vega-lite@5.5.0"></script>
        <script src="https://cdn.jsdelivr.net/npm/vega-embed@6.21.0"></script>
      </body>
    </Html>
  )
}