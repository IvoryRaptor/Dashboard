import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Loader from '../Loader'
import styles from './Page.less'
import Exception from '../antd-pro/Exception/'

export default class Page extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  componentDidCatch (error) {
    // Display fallback UI
    this.setState({ hasError: true })
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render () {
    const { className, children, loading = false, inner = false } = this.props
    const loadingStyle = {
      height: 'calc(100vh - 184px)',
      overflow: 'hidden',
    }

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (<div className="content-inner" style={{ background: '#f8f8f8' }}>
        <Exception type="500" />
      </div>)
    }

    return (
      <div
        className={classnames(className, {
          [styles.contentInner]: inner,
        })}
        style={loading ? loadingStyle : null}
      >
        {loading ? <Loader spinning /> : ''}
        {children}
      </div>
    )
  }
}


Page.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  loading: PropTypes.bool,
  inner: PropTypes.bool,
}
