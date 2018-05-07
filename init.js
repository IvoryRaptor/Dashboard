// /**
//  * Created by kwame on 11/01/2018.
//  */
//
// var fs = require("fs");
//
// dir = './src/pages/routes'
//
//
// var fs = require("fs")
// var path = require("path")
//
// var root = path.join(__dirname)
//
// let dirlist = []
// let dirreactive = []
//
//
// readDirSync(root + '/src/pages/shop/routes')
//
// function readDirSync(path){
//   var pa = fs.readdirSync(path);
//   pa.forEach(function(ele,index){
//     var info = fs.statSync(path+"/"+ele)
//     if(info.isDirectory()){
//       //console.log("dir: "+path+"/"+ele)
//       dirlist.push(path+"/"+ele)
//       readDirSync(path+"/"+ele);
//     }else{
//       //console.log("file: "+ele)
//     }
//   })
// }
//
//
// function dirreactivePrase(l1,l2) {
//   l1.forEach(function (name) {
//
//   })
// }
//
// function initFile(url,dirlist) {
//    dirlist.forEach(function (name) {
//      console.log(name)
//      // fs.write(name,url)
//      // fs.write(name,)
//      fs.writeFileSync(url,name)
//    })
// }
//
//
//
// console.log(dirlist)
// outfile = root + '/src/pages/shop/indexA.js'
//
// initFile(outfile,dirlist)
//
//
//
