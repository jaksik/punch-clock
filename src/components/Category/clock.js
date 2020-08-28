import React, { useState, useEffect } from 'react';

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

function Clock({ authUser, firebase, categoryId }) {

    const [clockedIn, toggleClock] = useState(false);

    const [timePunchId, updatePunchId] = useState("");

    const [clockOut, clockingOut] = useState(false);

    const [showEditForm, toggleEditForm] = useState(true);

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

    useEffect(() => {
        console.log("Time Punch Data: ", timePunchData)
        let totalTime = ((timePunchData.timeOutStamp - timePunchData.timeInStamp) / 1000) / 60;
        
        updateTimePunchData(prevState => ({
            ...prevState,
            "totalTime": totalTime
        }));
    }, [timePunchData.timeInStamp, timePunchData.timeOutStamp]);

    const toggle = () => toggleEditForm(!showEditForm);

    const punchClock = () => {
        let today = new Date();
        let currentMonth = today.getMonth() + 1;
        let currentDay = today.getDate();
        let currentHours = today.getHours();
        let currentMinutes = today.getMinutes();
        let time = (currentHours < 10 ? '0' : '') + currentHours + ':' + (currentMinutes < 10 ? '0' : '') + currentMinutes;
        let date = today.getFullYear() + '-' + (currentMonth < 10 ? "0" : "") + currentMonth + '-' + (currentDay < 10 ? "0" : "") + currentDay;
        let timeStamp = today.getTime();

        //Clock In
        if (!clockedIn) {

            updateTimePunchData({
                date: date,
                timeIn: time,
                timeInStamp: timeStamp,
                timeOut: "",
                timeOutStamp: 0,
                totalTime: 0,
                task: "",
                note: "",
            })

            firebase.createTimePunch(categoryId).push(timePunchData).then((snap) => {
                updatePunchId(snap.path.pieces_[3])
                toggleClock(true);
            });

            //Clock out
        } else {
            handleTimePunchData("timeOutStamp", timeStamp);
            handleTimePunchData("timeOut", time);
            clockingOut(true)
        }
    }

    const submitForm = () => {
        firebase.updateTimePunch(categoryId, timePunchId).set(timePunchData);
        toggleEditForm(false)
        clockingOut(false)
        toggleClock(false);
        console.log("timePUnchData: ", timePunchData)
    }

    const handleFormChange = e => {

        const { name, value } = e.target;

        updateTimePunchData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const updateTime = e => {
        const { name, value } = e.target;

        updateTimePunchData(prevState => ({
            ...prevState,
            [name]: value
        }));

        let today = new Date();


        if (name === "timeIn") {
            let timeInMinutes = value.substring(3);
            today.setMinutes(timeInMinutes);
            today.setSeconds(0)
            let timeStamp = today.getTime();
            updateTimePunchData(prevState => ({
                ...prevState,
                "timeInStamp": timeStamp
            }));

        } else if (name === "timeOut") {
            let timeOutMinutes = value.substring(3);
            today.setMinutes(timeOutMinutes);
            today.setSeconds(0)
            console.log("Today: ", today)
            let timeStamp = today.getTime();
            updateTimePunchData(prevState => ({
                ...prevState,
                "timeOutStamp": timeStamp
            }));
        }
    }

    const handleTimePunchData = (name, value) => {
        updateTimePunchData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <div>
            <Row>
                <Col xs={12} className="d-flex align-items-center justify-content-center">
                    {(clockedIn ? <h4>Clocked in at: {timePunchData.timeIn}</h4> : <div style={{ minHeight: `30px` }}></div>)}
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
                                            onChange={updateTime}
                                            value={timePunchData.timeIn || "00:00"}
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
                                            onChange={updateTime}
                                            value={timePunchData.timeOut || "00:00"}
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