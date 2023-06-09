import { useParams } from 'react-router-dom';
import { Empty, Popover, Steps, StepsProps } from 'antd';
import { t } from 'i18next';
import { ProcessingDocumentTypeEnum } from 'models/doc-main-models';
import { ProcessingDetailsRowDataType } from 'pages/shared/ProcessingDetailsPage/core/models';
import { useProcessingDetailsRes } from 'shared/hooks/ProcessingDetailQuery';

interface Props {
  processingDocumentType: ProcessingDocumentTypeEnum;
}

const customDot: StepsProps['progressDot'] = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        Step {index + 1} status: {status}
      </span>
    }>
    {dot}
  </Popover>
);

export default function ProcessingStepComponent({ processingDocumentType }: Props) {
  const { docId } = useParams();
  const { data } = useProcessingDetailsRes(processingDocumentType, Number(docId), true);

  const getStepItems = (
    processingDocumentType: ProcessingDocumentTypeEnum,
    data: ProcessingDetailsRowDataType[] | undefined
  ) => {
    if (processingDocumentType === ProcessingDocumentTypeEnum.INCOMING_DOCUMENT) {
      // {t(`user.role_v2.${role}`)}
      return [
        {
          className: 'step-item',
          title: t('common.processing_step.processing_step_in.step_1.title'),
          description: t('common.processing_step.processing_step_in.step_1.description', {
            department: data?.[0]?.department,
            fullName: data?.[0]?.fullName,
          }),
        },
        {
          className: 'step-item',
          title: t('common.processing_step.processing_step_in.step_2.title'),
          description: t('common.processing_step.processing_step_in.step_2.description', {
            department: data?.[1]?.department,
            fullName: data?.[1]?.fullName,
          }),
        },
        {
          className: 'step-item',
          title: t('common.processing_step.processing_step_in.step_3.title'),
          description: t('common.processing_step.processing_step_in.step_3.description', {
            department: data?.[2]?.department,
            fullName: data?.[2]?.fullName,
          }),
        },
      ];
    } else {
      const stepItems = data?.reduce((acc: any, item) => {
        return [
          ...acc,
          {
            className: 'step-item',
            title: t(`user.role_v2.${item?.docSystemRole}`),
            description: t('common.processing_step.processing_step_out.step_1.description', {
              department: item?.department,
              fullName: item?.fullName,
            }),
          },
        ];
      }, []);

      // if stepItems.length === 1, add 2 empty step
      if (stepItems?.length === 1) {
        stepItems?.splice(
          1,
          0,
          {
            className: 'step-item',
            title: '',
            description: '',
          },
          {
            className: 'step-item',
            title: '',
            description: '',
          }
        );
      }
      return stepItems;
      // return [
      //   {
      //     className: 'step-item',
      //     title: t('common.processing_step.processing_step_out.step_1.title'),
      //     description: t('common.processing_step.processing_step_out.step_1.description', {
      //       department: data?.[0]?.department,
      //       fullName: data?.[0]?.fullName,
      //     }),
      //   },
      //   {
      //     className: 'step-item',
      //     title: t('common.processing_step.processing_step_out.step_2.title'),
      //     description: t('common.processing_step.processing_step_out.step_2.description', {
      //       department: data?.[1]?.department,
      //       fullName: data?.[1]?.fullName,
      //     }),
      //   },
      //   {
      //     className: 'step-item',
      //     title: t('common.processing_step.processing_step_out.step_3.title'),
      //     description: t('common.processing_step.processing_step_out.step_3.description', {
      //       department: data?.[2]?.department,
      //       fullName: data?.[2]?.fullName,
      //     }),
      //   },
      // ];
    }
  };

  if (data?.length === 0) {
    return <Empty description={t('common.processing_step.not_processing_yet')} />;
  }

  return (
    <Steps
      progressDot={customDot}
      current={(data?.length ?? 1) - 1}
      items={getStepItems(processingDocumentType, data)}
    />
  );
}
