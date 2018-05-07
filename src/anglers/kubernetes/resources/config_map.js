import Resource from "../../../goshawk/fields/Resource"
import {InputField,ObjectSourceField,ObjectField} from "../../../goshawk/fields/"


export default new Resource({
  fields: {
    _id: new InputField({}),
    name: new InputField({required: true}),
    matrix: new ObjectSourceField({
      input: 'checkbox',
      type: 'array',
      source: 'matrix'
    }),
    files: new ObjectField({})
  }
})
