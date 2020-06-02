"use strict";
const url = require('url');

/**
 * Combination of both
 * https://github.com/vercel/next.js/blob/canary/packages/next/build/webpack/plugins/react-loadable-plugin.ts
 * https://github.com/jamiebuilds/react-loadable/blob/master/src/webpack.js
 * Modified to strip out unneeded results for Next's specific use case
 * The generated json is needed to sync up SSR modules with chunks loaded on client
 * the mian idea is to filter the only SSR chunks to reduce the size of this file
 * and heavy iteration on client
 * @param {Object} compiler - Webpack compiler conf
 * @param {Object} compilation - Webpack compilation result
 * @param {regex} chunkName - Regex to filter only ssr chunks
 * @returns {{}}
 */
function buildManifest(
  compiler,
  compilation,
  chunkName,
) {
  let context = compiler.options.context
  let manifest = {}

  compilation.chunkGroups.forEach((chunkGroup) => {
    if (chunkGroup.isInitial()) {
      return
    }

    chunkGroup.origins.forEach((chunkGroupOrigin) => {
      const { request } = chunkGroupOrigin

      chunkGroup.chunks.forEach((chunk) => {
        if(chunkGroup.options && chunkName.test(chunkGroup.options.name)) {

          chunk.files.forEach((file) => {
            if (!file.match(/\.js$/) || !file.match(/^static\/chunks\//)) {
              return
            }

            let publicPath = url.resolve(
              compilation.outputOptions.publicPath || '',
              file
            )

            const css = chunk.files.filter(
              (chunkFile) =>
                chunkFile.match(/\.css$/)
            )

            for (const module of chunk.modulesIterable) {
              let id = module.id
              let name =
                typeof module.libIdent === 'function'
                  ? module.libIdent({ context })
                  : null

              if (!manifest[request]) {
                manifest[request] = []
              }

              // Avoid duplicate files
              if (
                manifest[request].some(
                  (item) => item.id === id && item.file === file
                )
              ) {
                continue
              }

              manifest[request].push({
                id,
                name,
                file,
                publicPath,
                css,
              })
            }
          })
        }
      })
    })
  })

  manifest = Object.keys(manifest)
    .sort()
    // eslint-disable-next-line no-sequences
    .reduce((a, c) => ((a[c] = manifest[c]), a), {})
  debugger;
  return manifest
}

class ReactLoadableManifestGenerator {
  /**
   * Class constructor
   * @param {string} opts.fileName - Generated json file name
   * @param {regex} opts.chunksName - Regex to allow filtering
   * chunk only use for SSR, so naming convention is needed to
   * map those for example: /ssr-cpm/ for webpackChunkName: "liveblog-lazy-ssr-cpm"
   */
  constructor(opts) {
    this.fileName = opts.fileName;
    this.chunksName = opts.chunksName;
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('ReactLoadableManifest', (compilation, callback) => {
      const manifest = buildManifest(compiler, compilation, this.chunksName);
      var json = JSON.stringify(manifest, null, 0);
      compilation.assets[this.fileName] = {
        source() {
          return json;
        }, size() {
          return json.length;
        },
      };
      callback();
    });
  }
}

module.exports = ReactLoadableManifestGenerator;
