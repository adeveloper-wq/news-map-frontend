import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}