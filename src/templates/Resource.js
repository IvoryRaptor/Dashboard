import { Template } from '../goshawk/templates'

class Resource extends Template {
  constructor (obj) {
    super()
    this.key = obj.key
    this.fields = {}
    // for (let name of Object.keys(obj.fields)) {
    //   const fieldParam = obj.fields[name]
    //   fieldParam.key = name
    //   const field = window.goshawk.templates.create(fieldParam.template, fieldParam)
    //   field.resource = this
    //   this.fields[name] = field
    // }
    this.fields = this.mapField(obj)
  }

  mapField (obj) {
    // let self = this
    // let res = {}
    // if (obj.fields) {
    //   for (let name of Object.keys(obj.fields)) {
    //     const fieldParam = obj.fields[name]
    //     fieldParam.key = name
    //     const field = window.goshawk.templates.create(fieldParam.template, fieldParam)
    //     if (!field){
    //       console.log(obj, this)
    //     }
    //     field.resource = self
    //     field.fields = this.mapField(field)
    //     res[name] = field
    //   }
    //   return res
    // }
    // return null
  }

  getLocale () {
    return window.goshawk.getLocale(this.key)
  }

  setValues (object, values) {
    for (let key in values) {
      if (this.fields[key]) { this.fields[key].setValue(object, values[key]) }
    }
  }

  getField (name) {
    return this.fields[name]
  }
}
export default Resource
