import React, { Suspense } from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    '0': '#324AB2',
  },
});

interface Props {
  children: React.ReactNode;
}

export default function DocSuspenseComponent({ children }: Props) {
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
}
