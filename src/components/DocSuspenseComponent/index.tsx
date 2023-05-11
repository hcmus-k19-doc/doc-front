import React, { Suspense } from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';

interface Props {
  children: React.ReactNode;
}

export default function DocSuspenseComponent({ children }: Props) {
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
}
