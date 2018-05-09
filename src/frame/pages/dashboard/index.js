import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { color } from 'utils'
import { Page } from 'components'
import { NumberCard, Quote, Sales, Weather, RecentSales, Comments, Completed, Browser, Cpu, User } from './components'
// import styles from './index.less'

function Dashboard ({ dashboard, loading }) {
  if (!dashboard) {
    dashboard = {}
  }
  const {sales, audio, manager} = dashboard
  return (
    <Page loading={loading.models.dashboard && sales.length === 0}>
      {/*<Row gutter={24}>*/}
        {/*<Col key="audio" lg={8} md={12}>*/}
          {/*<NumberCard*/}
            {/*icon="link"*/}
            {/*color={color.green}*/}
            {/*title="Online Devices"*/}
            {/*number={audio}*/}
          {/*/>*/}
        {/*</Col>*/}
        {/*<Col key="manager" lg={8} md={12}>*/}
          {/*<NumberCard*/}
            {/*icon="user"*/}
            {/*color={color.blue}*/}
            {/*title="Online Admin"*/}
            {/*number={manager}*/}
          {/*/>*/}
        {/*</Col>*/}
      {/*</Row>*/}
      <Row gutter={24}>
        <Col key="manager" lg={8} md={12}>
          {/*<PieChartCard*/}
            {/*color={color.blue}*/}
            {/*title="在线音箱"*/}
            {/*number={manager}*/}
          {/*/>*/}
        </Col>
      </Row>
    </Page>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ dashboard, loading }) => ({ dashboard, loading }))(Dashboard)
