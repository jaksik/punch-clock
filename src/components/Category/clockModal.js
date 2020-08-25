
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

const ModalExample = (props) => {
  const {
    buttonLabel,
    className,
    categoryUid,
    clockOut,
  } = props;

  const [modal, setModal] = useState(clockOut);
  const [nestedModal, setNestedModal] = useState(false);
  const [closeAll, setCloseAll] = useState(false);

  const toggle = () => setModal(!modal);
  const toggleNested = () => {
    setNestedModal(!nestedModal);
    setCloseAll(false);
  }
  const toggleAll = () => {
    setNestedModal(!nestedModal);
    setCloseAll(true);
  }

  return (
    <Modal isOpen={clockOut} toggle={toggle} className={className}>
      <p>You logged:</p>
      <ModalHeader toggle={toggle} style={{textAlign:`center`}}>Monday July 23rd, 2020</ModalHeader>

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
          <Col xs={6}>
            
            </Col>
        </Row>


      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>Accept</Button>{' '}
        <Button color="secondary" onClick={toggle}>Edit</Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalExample;