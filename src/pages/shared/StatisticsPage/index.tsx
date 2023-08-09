import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { Button, Divider, Layout, Table, theme } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import { ColumnsType } from 'antd/es/table';
import { useAuth } from 'components/AuthComponent';
import PageHeader from 'components/PageHeader';
import ReactECharts from 'echarts-for-react';
import { t } from 'i18next';
import { DocSystemRoleEnum, ProcessingStatus } from 'models/doc-main-models';
import { RecoilRoot } from 'recoil';
import { useDocumentTypesRes } from 'shared/hooks/DocumentTypesQuery';
import { useChartStatisticsRes, useStatisticsRes } from 'shared/hooks/StatisticsQuery';

import { PRIMARY_COLOR } from '../../../config/constant';
import { useSweetAlert } from '../../../shared/hooks/SwalAlert';

import DirectorStatisticsSearchForm from './components/DirectorStatisticsSearchForm';
import StatisticsSearchForm from './components/StatisticsSearchForm';
import { TableRowDataType } from './core/models';

import './index.css';

const StatisticsPage: React.FC = () => {
  const { data: DocStatisticsData, isLoading } = useStatisticsRes();
  const { data: chartStatisticsDto } = useChartStatisticsRes();
  const { incomingDocumentStatisticsDto, documentTypeStatisticsWrapperDto } =
    chartStatisticsDto ?? {};
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { data: documentTypes } = useDocumentTypesRes();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const showAlert = useSweetAlert();

  const incomingPieChartOptions = {
    title: {
      text: t('statistics.incoming_document_pie_chart_title'),
      subtext: t('statistics.quarter', {
        quarter: chartStatisticsDto?.quarter,
        year: chartStatisticsDto?.year,
      }),
      x: 'center',
    },
    textStyle: {
      fontFamily: theme.useToken().token.fontFamily,
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
        quarter: chartStatisticsDto?.quarter,
        year: chartStatisticsDto?.year,
      }),
      x: 'center',
    },
    textStyle: {
      fontFamily: theme.useToken().token.fontFamily,
    },
    tooltip: {},
    legend: {
      data: documentTypeStatisticsWrapperDto?.seriesData.map((xAxisData) => xAxisData.name),
      orient: 'vertical',
      right: 'right',
    },
    xAxis: [
      {
        type: 'category',
        data: documentTypes?.map((documentType) => documentType.type),
      },
    ],
    yAxis: {},
    series: documentTypeStatisticsWrapperDto?.seriesData.map((seriesData) => ({
      name: seriesData.name,
      type: 'bar',
      data: [seriesData.value],
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    })),
  };

  const columns: ColumnsType<TableRowDataType> = [
    {
      title: t('statistics.table.columns.ordinal_number'),
      dataIndex: 'ordinalNumber',
    },
    {
      title: t('statistics.table.columns.name_of_handler'),
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

  const headers = [
    {
      label: t('statistics.csvHeader.ordinal_number'),
      key: 'ordinalNumber',
    },
    {
      label: t('statistics.csvHeader.name_of_handler'),
      key: 'expertName',
    },
    {
      label: t('statistics.csvHeader.on_time'),
      key: 'onTime',
    },
    {
      label: t('statistics.csvHeader.overdue_closed'),
      key: 'overdueClosedDoc',
    },
    {
      label: t('statistics.csvHeader.total_closed'),
      key: 'totalClosedDoc',
    },
    {
      label: t('statistics.csvHeader.unexpired'),
      key: 'unexpired',
    },
    {
      label: t('statistics.csvHeader.overdue_unprocessed'),
      key: 'overdueUnprocessedDoc',
    },
    {
      label: t('statistics.csvHeader.total_unprocessed'),
      key: 'totalUnprocessedDoc',
    },
    {
      label: t('statistics.csvHeader.on_time_processing_percentage'),
      key: 'onTimeProcessingPercentage',
    },
  ];

  const handleExportToCSV = async () => {
    setLoading(true);
    try {
      await showAlert({
        icon: 'success',
        html:
          t('statistics.message.file_name', {
            user: currentUser?.fullName,
          }) +
          ' ' +
          t('statistics.message.file_downloaded'),
        showConfirmButton: true,
      });
    } catch (error) {
      await showAlert({
        icon: 'error',
        html: t('statistics.message.file_download_failed'),
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

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
          <div className='text-lg text-primary'>{t('main_page.menu.items.statistics')}</div>
          {currentUser?.role === DocSystemRoleEnum.HIEU_TRUONG ? (
            <DirectorStatisticsSearchForm />
          ) : (
            <StatisticsSearchForm />
          )}
          <Divider />
          <div className='flex justify-center text-primary text-lg table-title'>
            {t('statistics.document_statistics_title')}
          </div>
          <div className='flex justify-center subtitle'>
            ({currentUser?.department.departmentName} - {t('statistics.handler_name')}:{' '}
            {currentUser?.fullName})
          </div>
          {DocStatisticsData?.fromDate !== '' && DocStatisticsData?.toDate !== '' ? (
            <div className='flex justify-center small-text'>
              ({t('statistics.from_date')} {DocStatisticsData?.fromDate} {t('statistics.to_date')}{' '}
              {DocStatisticsData?.toDate})
            </div>
          ) : (
            <div className='flex justify-center small-text'>({t('statistics.all_the_time')})</div>
          )}
          <Table
            style={{ width: '100%' }}
            loading={isLoading}
            rowClassName={() => 'row-hover'}
            columns={columns}
            dataSource={DocStatisticsData?.rowsData}
            pagination={false}
          />
          <div className='mt-5 flex' style={{ justifyContent: 'flex-end' }}>
            <div className='transfer-doc-wrapper'>
              <Button
                type='primary'
                className='transfer-doc-btn'
                loading={isLoading || loading}
                disabled={isLoading || loading}>
                <CSVLink
                  filename={`${t('statistics.message.file_name', {
                    user: currentUser?.fullName,
                  })}`}
                  headers={headers}
                  data={DocStatisticsData?.rowsData || []}
                  onClick={handleExportToCSV}>
                  {t('statistics.button.export')}
                </CSVLink>
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
