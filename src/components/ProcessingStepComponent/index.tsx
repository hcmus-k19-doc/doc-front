import { useParams } from 'react-router-dom';
import { Steps } from 'antd';
import { t } from 'i18next';
import { useProcessingDetailsRes } from 'shared/hooks/ProcessingDetailQuery';

export default function ProcessingStepComponent() {
  const { docId } = useParams();
  const { data } = useProcessingDetailsRes(Number(docId), true);

  return (
    <Steps
      progressDot
      current={(data?.length ?? 1) - 1}
      items={[
        {
          className: 'step-item',
          title: t('incomingDocDetailPage.processing_step.step_1.title'),
          description: t('incomingDocDetailPage.processing_step.step_1.description', {
            department: data?.[0]?.department,
            fullName: data?.[0]?.fullName,
          }),
        },
        {
          className: 'step-item',
          title: t('incomingDocDetailPage.processing_step.step_2.title'),
          description: t('incomingDocDetailPage.processing_step.step_2.description', {
            department: data?.[1]?.department,
            fullName: data?.[1]?.fullName,
          }),
        },
        {
          className: 'step-item',
          title: t('incomingDocDetailPage.processing_step.step_3.title'),
          description: t('incomingDocDetailPage.processing_step.step_3.description', {
            department: data?.[2]?.department,
            fullName: data?.[2]?.fullName,
          }),
        },
      ]}
    />
  );
}
