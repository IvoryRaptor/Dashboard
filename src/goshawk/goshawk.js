import util from 'util'
import dva from 'dva'
import createLoading from 'dva-loading'
import MQTT from 'mqtt'
import CryptoJS from "crypto-js"


function formatJson (obj) {
  for (let [name, value] of Object.entries(obj)) {
    if (util.isString(value)) {
      if (/^D:([0-9]*)$/.test(value)) {
        obj[name] = new Date(parseInt(/^D:([0-9]*)$/.exec(value)[1], 0))
      }
    } else if (util.isArray(value)) {
      obj[name] = value.map((item) => {
        if (util.isObject(item)) {
          return formatJson(item)
        }
        return item
      })
    } else if (util.isObject(value)) {
      formatJson(value)
    }
  }
  return obj
}

function JsonParse (msg) {
  return formatJson(JSON.parse(msg))
}

function sign (params,  deviceSecret, signMethod) {
  let build = ''
  const keys = Object.keys(params).sort()

  for (let key of keys) {
    build = build + key + params[key]
  }
  let data = null
  switch (signMethod){
    case "hmacsha1":
      data = CryptoJS.HmacSHA1(build, deviceSecret)
      break
    case "hmacmd5":
      data = CryptoJS.HmacSHA1(build, deviceSecret)
      break
    default:
      break
  }
  return data.toString()
}

class Goshawk {
  constructor(exports) {
    this.url = exports.url
    this.productKey = exports.productKey
    window.goshawk = this
    this.l18n = {}
    this.dva = dva({
      ...createLoading({
        effects: true,
      }),
      ...exports,
    })
    this.callbacks = {}
    this.resources = {}
    this.pages = {}
    this.cacheMsg = []
    this.routers = []
    this.callback = {}
    this.dva.use({
      onAction: () => {
        return (basedispatch) => {
          return (action) => {
            let spAction = action.type.split('/$')
            if (spAction.length === 2) {
              let sendObj = {
                resource: spAction[0].substr(0, spAction[0].length),
                action: spAction[1],
                payload: action.payload,
              }
              if (action.callback) {
                sendObj.callback = `${Math.random()}`.substring(2)
                this.callbacks[sendObj.callback] = action.callback
              }
              this.publish(
                spAction[0].substr(0, spAction[0].length),
                spAction[1],
                {payload: action.payload}
              )
              let newAction
              if (action.loading) {
                newAction = {
                  type: `${spAction[0]}/setValue`,
                  payload: {},
                }
                newAction.payload[action.loading] = false
                this.callback[`${spAction[0]}/_${spAction[1]}`] = newAction

                newAction = {
                  type: `${spAction[0]}/setValue`,
                  payload: {},
                }
                newAction.payload[action.loading] = true

                basedispatch(newAction)
              }
              newAction = {...action}
              newAction.type = `${spAction[0]}/${spAction[1]}`
              basedispatch(newAction)
              return
            }
            basedispatch(action)
          }
        }
      },
    })
  }

  getSource(name) {
    return this.dva._store.getState().source[name]
  }

  getLocale(path) {
    let result = this.l18n.cn;
    const sp = path.split('/')
    for (let i = 0; i < sp.length && result; i += 1) {
      result = result[sp[i]]
    }
    return result
  }

  router(r) {
    this.routers.push(r)
  }

  start(router, dom) {
    let g = this.routers
    console.log(g)
    this.dva.router((obj) => {
      return router(obj, g)
    })
    this.dva.start(dom)
    this.dispatch = this.dva._store.dispatch
  }

  publish(resource, action, payload) {
    console.log('out=>',resource, action, payload)
    if (this.mqtt && this.mqtt.connected) {
      this.mqtt.publish(`/${this.productKey}/${this.deviceName}/${resource}/${action}`, JSON.stringify(payload))
    }
  }

  connect(deviceName, secret) {
    const clientId = "123123123123";
    const t = "123455"
    const client = MQTT.connect(this.url, {
      clientId: clientId + '|securemode=2,signmethod=hmacsha1,timestamp=' + t + '|',
      username: deviceName + "&" + this.productKey,
      password: sign({
        productKey: this.productKey,
        deviceName: deviceName,
        clientId: clientId,
        timestamp: t
      }, secret, "hmacsha1")
    })
    client.on('connect', () => {
      this.deviceName = deviceName
      this.dispatch({
        type: `app/_login`,
        payload: {},
      });
      this.mqtt = client

    })

    client.on('message', (topic, message) => {
      const sp = topic.split('/')
      let text = new TextDecoder("utf-8").decode(message)
      const packet = {
        type: `${sp[2]}/${sp[3]}`,
        ...JSON.parse(text)
      }
      console.log('in=>',packet)
      this.dispatch(packet)
    })

    client.on('close', () => {
      console.log('close')
    })
  }
}

export default Goshawk
