const path = require('path')
const fs = require('fs')
const { version } = require('./package.json')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, '')
]
// export default [
//   {
//     l18n: {
//       cn: import('./kubernetes/l18n/cn')
//     },
//     models: {
//       config_map: import('./kubernetes/models/config_map'),
//       images: import('./kubernetes/models/images'),
//       namespace: import('./kubernetes/models/namespace'),
//       pod: import('./kubernetes/models/pod'),
//       service: import('./kubernetes/models/service'),
//     },
//     pages: [{
//       path: '/kubernetes/config_map',
//       component: () => import('./kubernetes/pages/config_map/')
//     }, {
//       path: '/kubernetes/images',
//       component: () => import('./kubernetes/pages/images/')
//     }],
//     resources: {
//       config_map: import('./kubernetes/resources/config_map'),
//     }
//   },
// ]
let text = 'export default ['
fs.readdirSync('src/anglers/').forEach(function(angler){
  const angler_path = 'src/anglers/' + angler
  if(fs.statSync(angler_path).isDirectory()){
    text += '{\n'
    text += '  l18n:{\n'
    fs.readdirSync(angler_path+'/l18n').forEach(function(l18n) {
      l18n = path.basename(l18n,'.js')
      text += `    ${l18n}: require('./${angler}/l18n/${l18n}'),`
    })
    text += '  },\n'
    text += '  models:{\n'
    fs.readdirSync(angler_path+'/models').forEach(function(model) {
      model = path.basename(model,'.js')
      text += `    ${model}: require('./${angler}/models/${model}'),\n`
    })
    text += '  },\n'
    text += '  pages:['
    fs.readdirSync(angler_path+'/pages').forEach(function(page) {
      text += `{\n`
      text += `        path: './${angler}/${page}',\n`
      text += `        component: ()=> require('./${angler}/pages/${page}'),\n`
      text += `    },`
    })
    text += '  ],\n'
    text += '  resources:{\n'
    fs.readdirSync(angler_path+'/resources').forEach(function(resource) {
      resource = path.basename(resource,'.js')
      text += `    ${resource}: require('./${angler}/resources/${resource}'),\n`
    })
    text += '  }\n'
    text += '  },\n'
  }
});

text+=']'

fs.writeFile('./src/anglers/index.js', text,  function(err) {
  if (err) {
    return console.error(err);
  }
});

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  // theme: "./theme.config.js",
  publicPath: `/${version}/`,
  outputPath: `./dist/${version}`,
  // 接口代理示例
  proxy: {
    "/api/v1/weather": {
      "target": "https://api.seniverse.com/",
      "changeOrigin": true,
      "pathRewrite": { "^/api/v1/weather": "/v3/weather" }
    },
    // "/api/v2": {
    //   "target": "http://192.168.0.110",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/api/v2" : "/api/v2" }
    // }
  },
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr",
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "style": true
          }
        ]
      ]
    },
    production: {
      extraBabelPlugins: [
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "style": true
          }
        ]
      ]
    }
  },
  dllPlugin: {
    exclude: ["babel-runtime", "roadhog", "cross-env"],
    include: ["dva/router", "dva/saga", "dva/fetch"]
  }
}
