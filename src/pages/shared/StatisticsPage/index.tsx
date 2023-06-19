import React from 'react';
import { Button, Divider, Layout, Table, theme } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import { ColumnsType } from 'antd/es/table';
import PageHeader from 'components/PageHeader';
import ReactECharts from 'echarts-for-react';
import { t } from 'i18next';
import { DocSystemRoleEnum, ProcessingStatus } from 'models/doc-main-models';
import { RecoilRoot } from 'recoil';
import { useStatisticsRes } from 'shared/hooks/StatisticsQuery';

import { useAuth } from '../../../components/AuthComponent';

import DirectorStatisticsSearchForm from './components/DirectorStatisticsSearchForm';
import StatisticsSearchForm from './components/StatisticsSearchForm';
import { TableRowDataType } from './core/models';

import './index.css';

const StatisticsPage: React.FC = () => {
  const { data: statisticsDto, isLoading } = useStatisticsRes();
  const { incomingDocumentStatisticsDto, documentTypeStatisticsWrapperDto } = statisticsDto || {};
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { currentUser } = useAuth();

  const incomingPieChartOptions = {
    title: {
      text: t('statistics.incoming_document_pie_chart_title'),
      subtext: t('statistics.quarter', {
        quarter: statisticsDto?.quarter,
        year: statisticsDto?.year,
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
      text: t('statistics.document_type_processed_title', {
        quarter: statisticsDto?.quarter,
        year: statisticsDto?.year,
      }),
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

  const dummyData: TableRowDataType[] = [
    {
      key: 1,
      id: 1,
      ordinalNumber: 1,
      expertName: 'Nguyễn Văn A',
      onTime: 10,
      overdueClosedDoc: 0,
      totalClosedDoc: 10,
      unexpired: 0,
      overdueUnprocessedDoc: 0,
      totalUnprocessedDoc: 0,
      onTimeProcessingPercentage: 50,
    },
    {
      key: 2,
      id: 2,
      ordinalNumber: 2,
      expertName: 'Trần Văn B',
      onTime: 15,
      overdueClosedDoc: 5,
      totalClosedDoc: 15,
      unexpired: 3,
      overdueUnprocessedDoc: 2,
      totalUnprocessedDoc: 5,
      onTimeProcessingPercentage: 70,
    },
  ];

  const columns: ColumnsType<TableRowDataType> = [
    {
      title: t('statistics.table.columns.ordinal_Number'),
      dataIndex: 'ordinalNumber',
    },
    {
      title: t('statistics.table.columns.expert_name'),
      dataIndex: 'expertName',
    },
    {
      title: t('statistics.table.columns.closed'),
      className: 'top-column',
      children: [
        {
          title: t('statistics.table.columns.on_time'),
          dataIndex: 'onTime',
        },
        {
          title: t('statistics.table.columns.overdue'),
          dataIndex: 'overdueClosedDoc',
        },
        {
          title: t('statistics.table.columns.total'),
          dataIndex: 'totalClosedDoc',
        },
      ],
    },
    {
      title: t('statistics.table.columns.unprocessed'),
      className: 'top-column',
      children: [
        {
          title: t('statistics.table.columns.unexpired'),
          dataIndex: 'unexpired',
        },
        {
          title: t('statistics.table.columns.overdue'),
          dataIndex: 'overdueUnprocessedDoc',
        },
        {
          title: t('statistics.table.columns.total'),
          dataIndex: 'totalUnprocessedDoc',
        },
      ],
    },
    {
      title: t('statistics.table.columns.on_time_processing_percentage'),
      dataIndex: 'onTimeProcessingPercentage',
    },
  ];

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
          <div className='text-lg text-primary'>{t('main_page.menu.items.report')}</div>
          {currentUser?.role === DocSystemRoleEnum.GIAM_DOC ? (
            <DirectorStatisticsSearchForm />
          ) : (
            <StatisticsSearchForm />
          )}
          <Divider />
          <Table
            style={{ width: '100%' }}
            loading={isLoading}
            rowClassName={() => 'row-hover'}
            columns={columns}
            // dataSource={data?.payload}
            dataSource={dummyData}
            // scroll={{ x: 1500 }}
            pagination={false}
            // footer={() => <Footer selectedDocs={selectedDocs} setSelectedDocs={setSelectedDocs} />}
          />
          <div className='mt-5 flex' style={{ justifyContent: 'flex-end' }}>
            <div className='transfer-doc-wrapper'>
              <Button
                type='primary'
                // onClick={handleOnOpenModal}
                className='transfer-doc-btn'>
                {t('statistics.button.export')}
              </Button>
            </div>
          </div>
          <Divider />
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
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        {t('common.footer', { year: new Date().getFullYear() })}
      </Footer>
    </Layout>
  );
};

const StatisticsPageWrapper = () => (
  <RecoilRoot>
    <StatisticsPage />
  </RecoilRoot>
);

export default StatisticsPageWrapper;
