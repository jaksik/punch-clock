import React, { useState, useEffect } from 'react';
import { Form } from 'reactstrap';

function Form() {
  const [count, setCount] = useState(0);

  const [timePunchData, updateTimePunchData] = useState(
    {
        date: "",
        timeIn: "",
        timeInStamp: 0,
        timeOut: "",
        timeOutStamp: 0,
        totalTime: 0,
        task: "",
        note: "",
    }
)

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  const punchClock = () => {

  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Form;