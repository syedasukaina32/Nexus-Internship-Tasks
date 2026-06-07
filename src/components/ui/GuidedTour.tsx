import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useAuth } from '../../context/AuthContext';

export const GuidedTour: React.FC = () => {
  const { user } = useAuth();
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Only run tour once per session for demo
    if (user && !sessionStorage.getItem('tourCompleted')) {
      setRun(true);
    }
  }, [user]);

  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to the new Nexus Collaboration features! Let us show you around.',
      placement: 'center',
    },
    {
      target: 'a[href="/calendar"]',
      content: 'Manage your availability and meeting requests in the new Calendar.',
      placement: 'right',
    },
    {
      target: 'a[href="/video-call"]',
      content: 'Jump into virtual meeting rooms directly from the platform.',
      placement: 'right',
    },
    {
      target: 'a[href="/documents"]',
      content: 'Upload and sign contracts legally in the Document Chamber.',
      placement: 'right',
    },
    {
      target: 'a[href="/payments"]',
      content: 'Manage your funds, deposits, and deal transfers here.',
      placement: 'right',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      sessionStorage.setItem('tourCompleted', 'true');
    }
  };

  if (!user) return null;

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#2563EB',
          textColor: '#1F2937',
          backgroundColor: '#FFFFFF',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    />
  );
};
