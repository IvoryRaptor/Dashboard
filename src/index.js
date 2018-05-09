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


anglers.map(item=> {
  const {l18n, models, pages, resources} = item;
  goshawk.l18n = _.merge(l18n, goshawk.l18n);
  for(let key in resources){
    goshawk.resources[key] = resources[key]
  }
  for(let name in models){
    goshawk.dva.model(models[name])
  }
  pages.map(page=>{
    goshawk.router(page)
  })
});

goshawk.start(require('./frame/router'), '#root')

// goshawk.open('ws://localhost:8080/mqtt')

export default goshawk
