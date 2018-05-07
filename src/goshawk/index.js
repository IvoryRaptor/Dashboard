import { connect } from 'dva'
import util from 'util'
import { Template } from './templates'
import Goshawk from './goshawk'
//
// const connectNew = (func) => {
//   const f = (value) => {
//     const { locale, template, resource, source,app } = value
//     console.log(func)
//     return {
//       goshawk: {
//         locale, template, resource, source, app
//       },
//       ...func(value),
//     }
//   }
//   return connect(f)
// }
//
const connectResource = (name, func) => {
  const f = (value) => {
    const { source, app } = value
    let dataset
    if (util.isArray(name)) {
      let obj = {}
      name.map((m) => {
        obj[m] = value[m]
      })
      dataset = obj
    } else {
      dataset = value[name]
    }

    // const dataResource = resource[name]
    return {
      // resource: dataResource,
      dataset,
      goshawk: {
        source, app,
      },
      ...func(value),
    }
  }
  return connect(f)
}

export {
  connect,
  connectResource,
  Template,
}

export default Goshawk
