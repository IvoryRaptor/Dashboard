import React from 'react'
import { Page } from 'components'
import { connectResource } from '../../../../goshawk/'
import TablePage from "../../../../templates/TablePage"

const ListPage = new TablePage({
  resource: 'config_map',
  filter: {
    buttons: [
      {
        action: 'create'
      }
    ]
  },



})
const filter= {
  buttons: [
    {
      action: 'create'
    }
  ]
}
const modal= {
  edit: {
    style: {top: 20},
    width: 750,
    fields: [
      'name'
    ]
  },
  create: {
    style: {top: 20},
    width: 750,
    fields: [
      'name'
    ]
  }
}
const table= {
  columns: [
    'name'
  ],
  operations: [
    {
      action: 'edit'
    },
    {
      action: 'delete'
    }
  ]
}
const setup= [
  {
    type: 'config_map/fetch'
  },
  {
    type: 'matrix/$all'
  }
]


export default connectResource('config_map', () => ({}))(<ListPage />)
