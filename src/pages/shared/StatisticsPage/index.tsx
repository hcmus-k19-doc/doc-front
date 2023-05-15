import React from 'react';
import { Layout, theme } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import PageHeader from 'components/PageHeader';
import ReactECharts from 'echarts-for-react';
import { t } from 'i18next';
import * as dateTimeUtils from 'utils/DateTimeUtils';

function StatisticsPage() {
  const option = {
    title: {
      text: t('statistics.title'),
      subtext: dateTimeUtils.getCurrentQuarter(),
      x: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['huhu', 'hihi', 'hehe', 'hoho', 'haha'],
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: 335, name: 'huhu' },
          { value: 310, name: 'hihi' },
          { value: 234, name: 'hehe' },
          { value: 135, name: 'hoho' },
          { value: 1548, name: 'haha' },
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <>
      <ReactECharts option={option} style={{ height: 400 }} />
    </>
  );
}

export default function StatisticsPageWrapper() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <PageHeader />
      <Content
        style={{
          padding: '0 50px',
          minHeight: '100vh',
          maxWidth: '50%',
        }}
        className='mt-12'>
        <Layout className='py-5' style={{ backgroundColor: colorBgContainer }}>
          <StatisticsPage />
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        {t('common.footer', { year: new Date().getFullYear() })}
      </Footer>
    </Layout>
  );
}
