import Document, { Html, Head, Main, NextScript } from 'next/document'
import { readFileSync } from 'fs';
import { join } from 'path';

class InlineStylesHead extends Head {
  getDynamicCssLinks() {
    const { dynamicImports } = this.context._documentProps

    return Object.keys(
        dynamicImports
        .map(({ css }) => css)
        .reduce((accum, css) => {
            const result = { ...accum }
            if (css) {
            css.forEach((link) => (result[link] = true))
            }
            return result
        }, {})
    )
  }

  getCssLinks() {
    const { assetPrefix, files } = this.context._documentProps
    const { _devOnlyInvalidateCacheQueryString } = this.context
    const cssFiles =
      files && files.length ? files.filter((f) => /\.css$/.test(f)) : []
    debugger;
    cssFiles.push(...this.getDynamicCssLinks())

    const cssLinkElements = [];
    cssFiles.forEach((file) => {
      cssLinkElements.push(
        <link
          key={`${file}-preload`}
          nonce={this.props.nonce}
          rel="preload"
          href={`${assetPrefix}/_next/${encodeURI(
            file
          )}${_devOnlyInvalidateCacheQueryString}`}
          as="style"
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
        />,
        <link
          key={file}
          nonce={this.props.nonce}
          rel="stylesheet"
          href={`${assetPrefix}/_next/${encodeURI(
            file
          )}${_devOnlyInvalidateCacheQueryString}`}
          crossOrigin={this.props.crossOrigin || process.crossOrigin}
        />
      )
    })

    return cssLinkElements.length === 0 ? null : cssLinkElements
  }
}

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <InlineStylesHead />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;