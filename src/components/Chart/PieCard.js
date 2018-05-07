import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Card } from 'antd'
import styles from './PieCard.less'
import createG2 from 'g2-react';
import { Stat } from 'g2';

function PieCard ({ icon, color, title, number, countUp }) {
  const Pie = createG2(chart => {
    chart.coord('theta');
    chart.legend(false);
    chart.intervalStack().position('count').color('item').label('count', {
      formatter: (val, item) => {
        return 'aaa';
      }
    }).tooltip('count', (item, count) => {
      count = count * 100 + '%';
      console.log(count);
      return {
        name: item,
        value: count
      };
    });
    chart.render();
  });

  const data=[
    { item: '离线设备', count: 60 },
    { item: '正常设备', count: 40 },
    // { item: '已连接', count: 17 },
  ]
  return (
    <Card className={styles.pieChartCard} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.content}>
        <p className={styles.title}>{title || 'No Title'}</p>
        <Pie
          data={data}
          width={300}
          padding={[ 20, 30, 20, 30]}
          height={150}
          plotCfg={{
            margin: [0, 0, 0, 0],
          }}
        />
      </div>
    </Card>
  )
}

PieCard.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
  number: PropTypes.number,
  countUp: PropTypes.object,
}

export default PieCard
