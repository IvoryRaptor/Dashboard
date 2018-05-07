import Field from './Field'

class NumberSourceField extends Field {
  showRender (obj, source) {
    let result = obj[this.key]
    source = source[this.source]
    if (source) {
      for (let item of source) {
        if (item._id === result) {
          result = item.name
          break
        }
      }
    }
    return result
  }
}

export default NumberSourceField

