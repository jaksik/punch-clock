
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, FormGroup, Label, Input } from 'reactstrap';

const ModalExample = (props) => {
  const {
    firebase,
    buttonLabel,
    className,
    categoryUid,
    clockOut,
    categoryId,
  } = props;

  const [modal, setModal] = useState(clockOut);

  const [clockOutData, updateClockOutData] = useState(
    {
      date: "",
      timeIn: "",
      timeOut: "",
      task: "",
      note: "",
    }
  )

  const toggle = () => setModal(!modal);

  const handleFormChange = e => {

    const { name, value } = e.target;

    updateClockOutData(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log("State: ", clockOutData)
  };

  const finishClockOut = () => {
    firebase.createTimePunch(categoryId).set(clockOutData)
  }

  return (
    <Modal isOpen={clockOut} toggle={toggle} className={className}>
      <p>You logged:</p>
      <h5 toggle={toggle} style={{ textAlign: `center` }}>Monday July 23rd, 2020</h5>

      <ModalBody>
        <Row>
          <Col xs={6}>
            <h5>Time In:</h5>
          </Col>
          <Col xs={6}>

          </Col>
          <Col xs={6}>
            <h5>Time Out:</h5>
          </Col>
          <Col xs={6}>

          </Col>
          <Col xs={6}>
            <h5>Total:</h5>
          </Col>
          <Col xs={12}>
            <FormGroup>
              <Label for="exampleSelectMulti">What were you doing ?</Label>
              <Input
                type="select"
                name="task"
                id="exampleSelectMulti"
                onChange={handleFormChange}
              >
                <option>Prospecting</option>
                <option>PFYNR</option>
                <option>COC</option>
                <option>Driving</option>
                <option>Meeting</option>
              </Input>
            </FormGroup>
          </Col>

        </Row>


      </ModalBody>
      <Col xs={12}>
        <FormGroup>
          <Label for="exampleText">Add a note:</Label>
          <Input
            type="textarea"
            name="note"
            id="exampleText"
            onChange={handleFormChange}
          />
        </FormGroup>
      </Col>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>Accept</Button>{' '}
        <Button color="secondary" onClick={toggle}>Edit</Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalExample;