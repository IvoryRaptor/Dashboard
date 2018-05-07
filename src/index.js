import { message } from 'antd'
import createHistory from 'history/createBrowserHistory'
import 'babel-polyfill'
import Goshawk from './goshawk'
import anglers from './anglers'

const goshawk = new Goshawk({
  history: createHistory(),
  onError: (error) => {
    message.error(error.message)
  } })


goshawk.templates.add(require('./templates'))

anglers(goshawk.loader)

goshawk.start(require('./frame/router'), '#root')

goshawk.open('ws://localhost:8080/mqtt')

export default goshawk
