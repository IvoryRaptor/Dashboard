import React from 'react'
import { Page } from 'components'
import { connectResource } from '../../../../goshawk/'

const goshawk = window.goshawk

const ListPage = ({ ...props }) => {
  const page = goshawk.pages[window.location.pathname]
  if (!page) {
    return null
  }
  page.template.init({ page, ...props })
  const pageConf = {
    tableConf: {},
    modalConf: {
      create: {
        style: { top: 20 },
        width: 750,
      },
      edit: {
        style: { top: 20 },
        width: 750,
      },
    },
    filterConf: {},
  }

  return (
    <Page inner>
      {page.template.render(pageConf)}
    </Page>
  )
}

export default connectResource('pod', () => ({}))(ListPage)
