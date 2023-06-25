import { useParams } from 'react-router-dom';
import { Empty, Popover, Skeleton, StepProps, Steps, StepsProps, Typography } from 'antd';
import { t } from 'i18next';
import { ProcessingDocumentTypeEnum } from 'models/doc-main-models';
import { ProcessingDetailsRowDataType } from 'pages/shared/ProcessingDetailsPage/core/models';
import { useProcessingDetailsRes } from 'shared/hooks/ProcessingDetailQuery';

const { Text } = Typography;

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
  const { data, isLoading } = useProcessingDetailsRes(processingDocumentType, Number(docId), true);

  function getStepItems(
    processingDocumentType: ProcessingDocumentTypeEnum,
    data: ProcessingDetailsRowDataType[] | undefined
  ): StepProps[] {
    if (processingDocumentType === ProcessingDocumentTypeEnum.INCOMING_DOCUMENT) {
      return [
        {
          className: 'step-item',
          title: t('common.processing_step.processing_step_in.step_1.title', {
            roleTitle: data?.[0]?.roleTitle,
          }),
          description: (
            <>
              <div>
                {t('common.processing_step.processing_step_in.step_1.description.department', {
                  department: data?.[0]?.department,
                })}
              </div>
              <div>
                {t('common.processing_step.processing_step_in.step_1.description.full_name', {
                  fullName: data?.[0]?.fullName,
                })}
              </div>
            </>
          ),
        },
        {
          className: 'step-item',
          title: t('common.processing_step.processing_step_in.step_2.title', {
            roleTitle: data?.[1]?.roleTitle,
          }),
          description: (
            <>
              <div>
                {t('common.processing_step.processing_step_in.step_2.description.department', {
                  department: data?.[1]?.department,
                })}
              </div>
              <div>
                {t('common.processing_step.processing_step_in.step_2.description.full_name', {
                  fullName: data?.[1]?.fullName,
                })}
              </div>
            </>
          ),
        },
        {
          className: 'step-item',
          title: t('common.processing_step.processing_step_in.step_3.title', {
            roleTitle: data?.[2]?.roleTitle,
          }),
          description: (
            <>
              <div>
                {t('common.processing_step.processing_step_in.step_3.description.department', {
                  department: data?.[2]?.department,
                })}
              </div>
              <div>
                {t('common.processing_step.processing_step_in.step_3.description.full_name', {
                  fullName: data?.[2]?.fullName,
                })}
              </div>
            </>
          ),
        },
      ];
    } else {
      const stepItems = data?.reduce((acc: any, item) => {
        return [
          ...acc,
          {
            className: 'step-item',
            title: item.roleTitle,
            description: (
              <>
                <div>
                  {t('common.processing_step.processing_step_out.step_1.description.department', {
                    department: item?.department,
                  })}
                </div>
                <div>
                  {t('common.processing_step.processing_step_out.step_1.description.full_name', {
                    fullName: item?.fullName,
                  })}
                </div>
              </>
            ),
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
      } else if (stepItems?.length === 2) {
        stepItems?.splice(2, 0, {
          className: 'step-item',
          title: '',
          description: '',
        });
      }
      return stepItems;
    }
  }

  if (data?.length === 0) {
    return <Empty description={t('common.processing_step.not_processing_yet')} />;
  }

  return (
    <Skeleton loading={isLoading}>
      <Steps
        progressDot={customDot}
        current={(data?.length ?? 1) - 1}
        items={getStepItems(processingDocumentType, data)}
      />
    </Skeleton>
  );
}
