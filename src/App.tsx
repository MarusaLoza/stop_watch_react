import './App.css';
import * as React from 'react';
import { render } from "react-dom";
import { useEffect, useState } from "react";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

type Status = "run" | "stop" | "wait" ;
 
export default function App() {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState<Status>("stop");
 
  useEffect(() => {
    const unsubscribe$ = new Subject();
    interval(1000)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (status === "run") setSec((val: any) => val + 1000);
      });
    return () => {
      unsubscribe$.next(true);
      unsubscribe$.complete();
    };
  }, [status]);
 
  const startWatch = React.useCallback(() => {
    setStatus("run");
  }, []);
 
  const stopWatch = React.useCallback(() => {
    setStatus("stop");
    setSec(0);
  }, []);
 
  const resetWatch = React.useCallback(() => {
    setSec(0);
    setStatus("run");
  }, []);
 
  var clickCount = 0;
  let timeoutID: any = 0;

  const waitWatch = React.useCallback(() => {
    clickCount++;

    if (clickCount === 2) {
      clickCount = 0;
      setStatus("wait");
       clearTimeout(timeoutID);
    }
    else if (clickCount === 1) {
      return;
    }
    timeoutID = setTimeout((() => true), 300);
  }, []);
 
  return (
    <div>
      <p className="time"> {new Date(sec).toISOString().slice(11, 19)}</p>
      <button className="btn" onClick={startWatch}>
        Start
      </button>
      <button className="btn"  onClick={stopWatch}>
        Stop
      </button>
      <button onClick={resetWatch} className="btn">Reset</button>
      <button onClick={waitWatch} className="btn">Wait</button>
    </div>
  );
}
 
render(<App />, document.getElementById("root"));
