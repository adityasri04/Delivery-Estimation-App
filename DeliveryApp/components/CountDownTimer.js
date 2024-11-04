import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const CountdownTimer = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState(deadline - new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(deadline - new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [deadline]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return <Text>Time Left: {formatTime(timeLeft)}</Text>;
};

export default CountdownTimer;
    