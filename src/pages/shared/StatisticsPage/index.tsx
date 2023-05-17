import React from 'react';
import { Layout, theme } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import PageHeader from 'components/PageHeader';
import ReactECharts from 'echarts-for-react';
import { t } from 'i18next';
import { ProcessingStatus } from 'models/doc-main-models';
import { useStatisticsRes } from 'shared/hooks/StatisticsQuery';

function StatisticsPage() {
  const { data, isLoading } = useStatisticsRes();
  const { incomingDocumentStatisticsDto, documentTypeStatisticsWrapperDto } = data || {};

  const incomingPieChartOptions = {
    title: {
      text: t('statistics.incoming_document_pie_chart_title'),
      subtext: t('statistics.quarter', {
        quarter: incomingDocumentStatisticsDto?.quarter,
        year: incomingDocumentStatisticsDto?.year,
      }),
      x: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: [
        t(`statistics.series.data.${ProcessingStatus.UNPROCESSED}`),
        t(`statistics.series.data.${ProcessingStatus.IN_PROGRESS}`),
        t(`statistics.series.data.${ProcessingStatus.CLOSED}`),
      ],
    },
    series: [
      {
        name: t('statistics.series.name'),
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          {
            value: incomingDocumentStatisticsDto?.numberOfUnprocessedDocument,
            name: t(`statistics.series.data.${ProcessingStatus.UNPROCESSED}`),
          },
          {
            value: incomingDocumentStatisticsDto?.numberOfProcessingDocument,
            name: t(`statistics.series.data.${ProcessingStatus.IN_PROGRESS}`),
          },
          {
            value: incomingDocumentStatisticsDto?.numberOfProcessedDocument,
            name: t(`statistics.series.data.${ProcessingStatus.CLOSED}`),
          },
        ],
        emphasis: {
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      },
    ],
  };

  const processingDocumentTypeBarChartOptions = {
    title: {
      text: t('statistics.document_type_processed_title'),
      x: 'center',
    },
    tooltip: {},
    legend: {
      data: documentTypeStatisticsWrapperDto?.seriesData.map((xAxisData) => xAxisData.name),
      orient: 'vertical',
      right: 'right',
    },
    xAxis: {},
    yAxis: {},
    series: documentTypeStatisticsWrapperDto?.seriesData.map((seriesData) => {
      return {
        name: seriesData.name,
        type: 'bar',
        data: [seriesData.value],
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      };
    }),
  };

  return (
    <div className='flex justify-between'>
      <ReactECharts
        showLoading={isLoading}
        option={incomingPieChartOptions}
        style={{ height: 400, width: '50%' }}
        opts={{ renderer: 'svg' }}
      />
      <ReactECharts
        showLoading={isLoading}
        option={processingDocumentTypeBarChartOptions}
        style={{ height: 400, width: '50%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
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
