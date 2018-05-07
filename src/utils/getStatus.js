function getOrderStatus (orderStatus) {
  let statusText
  switch (orderStatus) {
    case 0:
      statusText = '等待买家付款'
      break
    case 1:
      statusText = '付款成功'
      break
    case 2:
      statusText = '待发货'
      break
    case 3:
      statusText = '等待收货'
      break
    case 4:
      statusText = '已签收'
      break
    case 5:
      statusText = '交易完成'
      break
    case -1:
      statusText = '已取消'
      break
    case -2:
      statusText = '退款中'
      break
    case -3:
      statusText = '已删除'
      break
    case -4:
      statusText = '交易关闭'
      break
    default:
      statusText = ''
  }
  return statusText
}

function getRefundStatus (refundStatus) {
  let text
  let badge

  switch (refundStatus) {
    case 0:
      text = '申请已提交'
      badge = 'processing'
      break
    case 1:
      text = '等待退货'
      badge = 'processing'
      break
    case 2:
      text = '退货确认中'
      badge = 'processing'
      break
    case 3:
      text = '退款中'
      badge = 'warning'
      break
    case 4:
      text = '退款完成'
      badge = 'success'
      break
    case -1:
      text = '已处理'
      badge = 'success'
      break
    default:
      text = ''
      badge = 'processing'
  }
  return {
    text,
    badge,
  }
}


export default {
  getOrderStatus,
  getRefundStatus,
}
