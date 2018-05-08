import { message } from 'antd'
import createHistory from 'history/createBrowserHistory'
import 'babel-polyfill'
import Goshawk from './goshawk'
import anglers from './anglers/'

const goshawk = new Goshawk({
  history: createHistory(),
  onError: (error) => {
    message.error(error.message)
  } });


// goshawk.templates.add(require('./templates'))
anglers.map(item=> {
  const {l18n, models, pages, resources} = item;
  goshawk.l18n = _.merge(l18n, goshawk.l18n);
  for(let key in resources){
    goshawk.resources[key] = resources[key]
  }
  console.log(goshawk.l18n.cn.config_map.title)

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
