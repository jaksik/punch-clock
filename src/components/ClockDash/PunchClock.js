import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Label, Spinner } from 'reactstrap';
import { plus, date, minus, time, timeStamp } from './GetDate';

function PunchClock({ firebase, categoryId, currentTimePunch, stillClockedIn }) {

  const [clockedIn, punchClock] = useState(false);

  const [clockingOut, toggleClockingOut] = useState(false);

  const [loading, toggleLoading] = useState(false);

  const [currentPunchId, updatePunchId] = useState('');

  const [clockData, updateClockData] = useState({});

  useEffect(() => {
    if (stillClockedIn && !clockedIn) {
      updateClockData(currentTimePunch);
      updatePunchId(currentTimePunch.uid);
      punchClock(true);
    }
  }) 

  useEffect(() => {
    if (clockedIn == true && !stillClockedIn) {
      firebase.createTimePunch(categoryId).push(clockData).then((snap) => {
        updatePunchId(snap.path.pieces_[3])
      })
    }
  }, [clockedIn])

  const handleFormChange = e => {

    const { name, value } = e.target;

    updateClockData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClockPunch = () => {
    if (clockedIn == false) {
      updateClockData(
        {
          dateIn: date(),
          timeIn: time(),
          timeInStamp: timeStamp(),
          dateOut: "",
          timeOut: "",
          timeOutStamp: 0,
          totalTime: 0,
          task: "",
          note: "",
        }
      )
      punchClock(true);

    } else if (clockedIn == true) {
      toggleClockingOut(true)
      updateClockData(prevState => ({
        ...prevState,
        "dateOut": date(),
        "timeOut": time(),
        "timeOutStamp": timeStamp(),
        "task": "Prospecting",
      }));
    }
  }

  const submitForm = () => {
    toggleLoading(true);
    firebase.updateTimePunch(categoryId, currentPunchId).set(clockData).then(() => {
      console.log("Time Punch Updated");
      toggleClockingOut(false);
      punchClock(false);
      toggleLoading(false);
      updateClockData({});
    });
  }

  console.log("Get Date: ", plus(3, 4))

  return (
    <div>
      {(loading ?

        <Spinner color="info" />

        :

        <Modal isOpen={clockingOut}>
          <Label>Start Date</Label>
          <Input
            type="date"
            name="dateIn"
            value={clockData.dateIn}
            onChange={handleFormChange}
          />
          <Label>Start Time</Label>
          <Input
            type="time"
            name="timeIn"
            onChange={handleFormChange}
            value={clockData.timeIn || "00:00"}
          />
          <Label>Finish Date</Label>
          <Input
            type="date"
            name="dateOut"
            value={clockData.dateOut}
            onChange={handleFormChange}
          />
          <Label>Finish Time</Label>
          <Input
            type="time"
            name="timeOut"
            onChange={handleFormChange}
            value={clockData.timeOut || "00:00"}
          />
          <Label>What were you doing ?</Label>
          <Input
            type="select"
            name="task"
            onChange={handleFormChange}
            value={clockData.task}
          >
            <option>Prospecting</option>
            <option>PFYNR</option>
            <option>COC</option>
            <option>Driving</option>
            <option>Meeting</option>
          </Input>
          <Label>Add a note:</Label>
          <Input
            type="textarea"
            name="note"
            onChange={handleFormChange}
            value={clockData.note}
          />
          <Button color="primary" onClick={submitForm}>Accept</Button>{' '}
        </Modal>

      )}

      <Button
        onClick={handleClockPunch}
        color={(clockedIn ? "danger" : "success")}
        size="lg"
        block
        className="mt-3 mb-3 btn-block"
      >
        {(clockedIn ? "Clock Out" : "Clock In")}
      </Button>
    </div>
  );
}

export default PunchClock