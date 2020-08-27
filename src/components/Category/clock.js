import React, { useState } from 'react';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Button, Modal, ModalBody, ModalFooter, Row, Col, FormGroup, Label, Input } from 'reactstrap';

const ClockComponent = ({ authUser, categoryId }) => {
    return (
        <div style={{ width: `90%` }}>
            <Dash authUser={authUser} categoryId={categoryId} />
        </div>
    )
};

const Clock = ({ authUser, firebase, categoryId }) => {

    const [clockedIn, toggleClock] = useState(false);

    const [timePunchId, updatePunchId] = useState("");

    const [clockOut, clockingOut] = useState(false);

    const [modal, setModal] = useState(clockOut);

    const [showEditForm, toggleEditForm] = useState(true);


    const toggle = () => toggleEditForm(!showEditForm);


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

    const punchClock = () => {
        let today = new Date();
        let currentMonth = today.getMonth() + 1;
        let currentDay = today.getDate();
        let currentHours = today.getHours();
        let currentMinutes = today.getMinutes();
        let time = (currentHours < 10 ? '0' : '') + currentHours + ':' + (currentMinutes < 10 ? '0' : '') + currentMinutes;
        let date = today.getFullYear() + '-' + (currentMonth < 10 ? "0" : "") + currentMonth + '-' + (currentDay < 10 ? "0" : "") + currentDay;
        let timeStamp = today.getTime();

        let totalTime = timeStamp - timePunchData.timeInStamp;

        //Clock In
        if (!clockedIn) {
            updateTimePunchData({
                date: date,
                timeIn: time,
                timeInStamp: timeStamp,
                timeOut: "",
                timeOutStamp: 0,
                totalTime: 0,
                task: "Prospecting",
                note: "",
            })
            firebase.createTimePunch(categoryId).push(timePunchData).then((snap) => {
                updatePunchId(snap.path.pieces_[3])
                toggleClock(true);
            });

        //Clock out
        } else {
            updateTimePunchData({
                date: date,
                timeIn: timePunchData.timeIn,
                timeInStamp: timePunchData.timeInStamp,
                timeOut: time,
                timeOutStamp: timeStamp,
                totalTime: totalTime,
                task: timePunchData.task,
                note: "",
            })
            clockingOut(true)
        }
    }

    const submitForm = () => {
        firebase.updateTimePunch(categoryId, timePunchId).set(timePunchData);
        toggleEditForm(false)
        clockingOut(false)
        toggleClock(false);
    }

    const handleFormChange = e => {

        const { name, value } = e.target;

        updateTimePunchData(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log("State: ", timePunchData)
        calculateTotalTime()
    };

    const calculateTotalTime = () => {
        let timeInMinutes = timePunchData.timeIn.substring(3);
        console.log("Time In: ", timeInMinutes);
        console.log("Time Out: ", timePunchData.timeOut);
        let today = new Date();
        console.log("New Date: ", today);
        today.setMinutes(timeInMinutes);
        console.log("Date updated minutes: ", today);


    }

    return (
        <div>
            <Row>
                <Col xs={12} className="d-flex align-items-center justify-content-center">
                {(clockedIn ? <h4>Clocked in at: {timePunchData.timeIn}</h4> : <div style={{minHeight:`30px`}}></div>)}
                </Col>
            </Row>
            <Button
                onClick={punchClock}
                color={(clockedIn ? "danger" : "success")}
                size="lg"
                block
                className="mt-3 mb-3 btn-block"
            >
                {(clockedIn ? "Clock Out" : "Clock In")}
            </Button>

            {/* Modal */}

            <Modal isOpen={clockOut} toggle={toggle}>
                <p>You logged: {timePunchData.totalTime}</p>

                {
                    showEditForm
                        ?
                        <FormGroup>
                            <Input
                                type="date"
                                name="date"
                                id="exampleDate"
                                placeholder="date placeholder"
                                value={timePunchData.date}
                                onChange={handleFormChange}

                            />
                        </FormGroup>
                        :
                        <h5 style={{ textAlign: `center` }}>{timePunchData.date}</h5>
                }

                <ModalBody>
                    <Row>
                        <Col xs={6}>
                            <h5>Time In:</h5>
                        </Col>
                        <Col xs={6}>
                            {
                                showEditForm
                                    ?
                                    <FormGroup>
                                        <Input
                                            type="time"
                                            name="timeIn"
                                            id="exampleTime"
                                            onChange={handleFormChange}
                                            value={timePunchData.timeIn}
                                        />
                                    </FormGroup>
                                    :
                                    <p>{timePunchData.timeOut}</p>
                            }
                        </Col>
                        <Col xs={6}>
                            <h5>Time Out:</h5>
                        </Col>
                        <Col xs={6}>
                            {
                                showEditForm
                                    ?
                                    <FormGroup>
                                        <Input
                                            type="time"
                                            name="timeOut"
                                            id="exampleTime"
                                            placeholder="time placeholder"
                                            onChange={handleFormChange}
                                            value={timePunchData.timeOut}
                                        />
                                    </FormGroup>
                                    :
                                    <p>{timePunchData.timeOut}</p>
                            }
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
                                    value="Prospecting"
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
                    <Button color="primary" onClick={submitForm}>Accept</Button>{' '}
                    <Button color="secondary" onClick={toggle}>{showEditForm ? `Cancel` : `Edit`}</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
};


const condition = authUser => !!authUser;
const Dash = withFirebase(Clock);

export default withAuthorization(condition)(ClockComponent);