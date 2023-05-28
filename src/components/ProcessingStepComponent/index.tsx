import { useParams } from 'react-router-dom';
import { Steps } from 'antd';
import { t } from 'i18next';
import { ProcessingDocumentTypeEnum } from 'models/doc-main-models';
import { useProcessingDetailsRes } from 'shared/hooks/ProcessingDetailQuery';

interface Props {
  processingDocumentType: ProcessingDocumentTypeEnum;
}

export default function ProcessingStepComponent({ processingDocumentType }: Props) {
  const { docId } = useParams();
  const { data } = useProcessingDetailsRes(processingDocumentType, Number(docId), true);

  return (
    <Steps
      progressDot
      current={(data?.length ?? 1) - 1}
      items={[
        {
          className: 'step-item',
          title: t('common.processing_step.step_1.title'),
          description: t('common.processing_step.step_1.description', {
            department: data?.[0]?.department,
            fullName: data?.[0]?.fullName,
          }),
        },
        {
          className: 'step-item',
          title: t('common.processing_step.step_2.title'),
          description: t('common.processing_step.step_2.description', {
            department: data?.[1]?.department,
            fullName: data?.[1]?.fullName,
          }),
        },
        {
          className: 'step-item',
          title: t('common.processing_step.step_3.title'),
          description: t('common.processing_step.step_3.description', {
            department: data?.[2]?.department,
            fullName: data?.[2]?.fullName,
          }),
        },
      ]}
    />
  );
}
