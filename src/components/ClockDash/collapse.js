import React, { useState, useEffect } from 'react';
import { Collapse, Button, CardBody, Card, Row, Col } from 'reactstrap';

const Example = ({ timePunch, editTimePunch, value }) => {
    const [isOpen, setIsOpen] = useState(false);
    // console.log("Time punch", timePunch)
    const toggle = () => setIsOpen(!isOpen);
    const [timePunchObject, setTimePunch] = useState({});
    // const editTimePunch = () => {
    //     console.log("Edit")
    // }
    // useEffect (() => {
    //     setTimePunch(timePunch);
    //     console.log("Set time punch", timePunch)

    // })
    return (
        <>
        <Row key={timePunch.uid} color={timePunch.theme} onClick={toggle}>
            <Col>{timePunch.dateIn}</Col>
            <Col>{timePunch.task}</Col>
            <Col>{timePunch.timeIn}</Col>
            <Col>{timePunch.timeOut}</Col>
            {/* <Col>{readableTime}</Col> */}
            </Row>
            <Row>
            <Col xs={12}>
                <Collapse isOpen={isOpen}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col xs={12}>Time In: {timePunch.timeIn}</Col>
                                <Col xs={12}>Time Out: {timePunch.timeOut}</Col>
                                <Col xs={12}>End Date: {timePunch.dateOut}</Col>
                                <Col xs={12}><Button onClick={editTimePunch} value={value} timepunch={timePunch}>Edit Time Punch</Button></Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Collapse>
            </Col>
        </Row>
        </>
    );
}

export default Example;