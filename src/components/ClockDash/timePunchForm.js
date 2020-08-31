import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Label, Spinner } from 'reactstrap';
import { plus, date, minus, time, timeStamp } from './GetDate';

function PunchClock({ firebase, categoryId, currentTimePunch, toggle, showEditForm }) {

  const [currentPunchId, updatePunchId] = useState('');

  const [clockData, updateClockData] = useState({});

  const [closeModal, updateModal] = useState(false);


  useEffect(() => {
      updateClockData(currentTimePunch);
      updatePunchId(currentTimePunch.uid);
      console.log("Clock Data: ", currentPunchId);
  }, [showEditForm]) 

  const handleFormChange = e => {

    const { name, value } = e.target;

    updateClockData(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log("Clock Data: ", clockData);

  };

  const submitForm = () => {
    firebase.updateTimePunch(categoryId, currentPunchId).set(clockData).then(() => {
      updateClockData({});
      toggle();
    });
  }

  const deleteTimePunch = () => {
    firebase.updateTimePunch(categoryId, currentPunchId).remove().then(() => {
        updateClockData({});
        toggle();
    });
}

  return (
    <div>
        <Modal isOpen={showEditForm}>
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
        <Button onClick={deleteTimePunch} color="danger">Delete</Button>
        </Modal>
    </div>
  );
}

export default PunchClock