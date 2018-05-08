import { message } from 'antd'
import createHistory from 'history/createBrowserHistory'
import 'babel-polyfill'
import Goshawk from './goshawk'
import anglers from './anglers/'
import resources from "./anglers/kubernetes/resources";
import pages from "./anglers/kubernetes/pages";
import locale from "./anglers/kubernetes/locale";

const goshawk = new Goshawk({
  history: createHistory(),
  onError: (error) => {
    message.error(error.message)
  } });


// goshawk.templates.add(require('./templates'))
anglers.map(item=>{
  const {locale, pages, resources} = item;
  console.log(locale, pages, resources);
});
// anglers.map(item=>{
//   const {locale, pages, resources} = item;
//   console.log(locale,
//     pages,
//     resources,)
// });
// console.log(anglers)
// anglers.map(ang=>{
//   // goshawk.angler(ang)
// });

goshawk.start(require('./frame/router'), '#root')

// goshawk.open('ws://localhost:8080/mqtt')

export default goshawk
