import React, { useEffect, useState } from 'react';
import { Steps, Divider } from 'antd';

const { Step } = Steps;

const Levels = () => {
  const [level, setLevel] = useState<number>(0);

  const handlePostMessage = (message: any) => {
    switch (message?.data.type) {
      case 'SET_LEVEL': {
        setLevel(message?.data.payload);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false);
    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  return (
    <React.Fragment>
      <Steps progressDot current={level}>
        <Step title="Первое нажатие" description="Попробуем?" />
        <Step title="Второе нажатие" />
        <Step title="Третье нажатие" description="Круто!" />
      </Steps>
      <Divider />
    </React.Fragment>
  );
};

export default Levels;
