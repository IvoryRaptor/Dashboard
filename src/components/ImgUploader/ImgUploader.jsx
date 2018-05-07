import React from 'react'
import util from 'util'
import PropTypes from 'prop-types'
import { Upload, Icon, message } from 'antd'

function getBase64 (img, callback) {
  const reader = new window.FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function setFileList (data) {
  let list = []
  if (util.isArray(data)) {
    data.map((item, index) => {
      list.push({
        uid: index,
        type: 'array',
        status: 'done',
        url: data[index],
      })
    })
  } else if (util.isString(data) && data.length) {
    list.push({
      uid: -1,
      type: 'thumb',
      status: 'done',
      url: data,
    })
  }
  return list
}

class ImgUploader extends React.Component {
  constructor (props) {
    super(props)
    const {
      dispatch,
      type = 'array',
      data,
      onUploaded,
      max,
      disabled,
      ...other
    } = props
    this.state = {
      fileList: setFileList(data),
      maxlength: max || 25,
      type: type || 'array',
      settings: other,
    }
  }

  beforeUpload = (file) => {
    const { dispatch, onUploaded } = this.props
    const isValid = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isValid) {
      message.error('目前只支持 JPG / PNG 格式图片!')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 0.7
    if (!isLt2M) {
      message.error('图片大小必须小于700kb!')
      return false
    }
    const hide = message.loading('图片上传中', 0)
    getBase64(file, base64 =>
      dispatch({
        type: 'image/$upload',
        payload: { img: base64 },
        callback: ({ payload }) => {
          hide()
          onUploaded(payload.img)
        },
      })
    )
    return false
  }

  render () {
    const { maxlength, type, settings } = this.state
    const fileList = setFileList(this.props.data)
    const UploadProps = {
      fileList,
      listType: 'picture-card',
      multiple: type === 'array',
      beforeUpload: this.beforeUpload,
      showUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: !this.props.disabled,
      },
      ...settings,
    }
    return (
      <Upload {...UploadProps}>
        {fileList.length < maxlength && !this.props.disabled && (
          <div>
            <Icon type={'plus'} />
            <div>Upload</div>
          </div>
        )}
      </Upload>
    )
  }
}
/*
const ImgUploader = ({
  dispatch,
  type = 'array',
  data,
  onUploaded,
  max,
  disabled,
  ...props
}) => {
  const maxlength = max || 25
  let fileList = []

  if (util.isArray(data)) {
    data.map((item, index) => {
      fileList.push({
        uid: index,
        type: 'array',
        status: 'done',
        url: data[index],
      })
    })
  } else if (util.isString(data) && data.length) {
    fileList.push({
      uid: -1,
      type: 'thumb',
      status: 'done',
      url: data,
    })
  }

  const beforeUpload = (file) => {
    const isValid = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isValid) {
      message.error('目前只支持 JPG / PNG 格式图片!')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 0.7
    if (!isLt2M) {
      message.error('图片大小必须小于700kb!')
      return false
    }
    const hide = message.loading('图片上传中', 0)
    getBase64(file, base64 =>
      dispatch({
        type: 'image/$upload',
        payload: { img: base64 },
        callback: ({ payload }) => {
          hide()
          onUploaded(payload.img)
        },
      })
    )
    return false
  }

  const UploadProps = {
    fileList,
    listType: 'picture-card',
    multiple: type === 'array',
    beforeUpload,
    disabled,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: !disabled,
    },
    ...props,
  }

  return (
    <Upload {...UploadProps}>
      {fileList.length < maxlength && !disabled && (
        <div>
          <Icon type={'plus'} />
          <div>Upload</div>
        </div>
      )}
    </Upload>
  )
}
*/

ImgUploader.propTypes = {
  dispatch: PropTypes.func.isRequired,
  type: PropTypes.string,
  onUploaded: PropTypes.func.isRequired,
  max: PropTypes.number,
}

export default ImgUploader
