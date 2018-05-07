import util from 'util'

const templates = {}

class Template {

}


const isTemplate = (item) => {
  if (!util.isFunction(item)) return false
  while (item.__proto__ !== Template) {
    item = item.__proto__
    if (item === Template.__proto__) { return false }
  }
  return true
}

export default {
  get (key) {
    return templates[key]
  },
  set (key, template) {
    templates[key] = template
  },
  add (m) {
    if (!m) return
    if (m.default) {
      m = m.default
    }
    for (let name in m) {
      const t = m[name]
      if (isTemplate(t)) {
        templates[name] = (values) => {
          return Reflect.construct(m[name], [values])
        }
      } else {
        templates[name] = m[name]
      }
    }
  },
  create (key, object) {
    const template = templates[key]
    if (template) {
      return template(object)
    }
    // throw `unknown template ${template}`
    return null
  },
}

export {
  Template,
}
