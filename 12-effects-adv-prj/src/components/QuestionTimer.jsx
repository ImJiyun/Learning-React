import { useEffect, useState } from "react";
export default function QuestionTimer({ timeout, onTimeout }) {
  const [remainingTime, setRemainingTime] = useState(timeout);

  // dependencies array inclues props and state that the effect depends on
  useEffect(() => {
    console.log("SETTING TIMEOUT");
    // every timeout passess, the component will re-render
    const timer = setTimeout(() => {
      onTimeout();
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [timeout, onTimeout]);

  // when dependecis array changes, the effect will run
  useEffect(() => {
    console.log("SETTING INTERVAL");
    // update the remaining time every 100ms
    const interval = setInterval(() => {
      // this will cause an infinite loop because the state is updated every 100ms
      setRemainingTime((prevRemainingTime) => {
        return prevRemainingTime - 100;
      });
    }, 100);

    // cleanup function
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress id="question-time" max={timeout} value={remainingTime} />;
}
