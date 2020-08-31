import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'reactstrap'
import TimePunchRow from './collapse';
import { Col, Row } from 'reactstrap'
import TimePunchForm from './timePunchForm';

function TimePunchList({ timePunches, loading, firebase, categoryId }) {

    const [showEditForm, toggleEditForm] = useState(false);
    const [selectedTimePunch, selectTimePunch] = useState({});

    const editTimePunch = event => {
        event.preventDefault();
        let timeData = event.target.value;  
        console.log("Edit time punch", timeData);
        selectTimePunch(timePunches[timeData]);
        toggleEditForm(!showEditForm);
    }

    const toggle = () => toggleEditForm(!showEditForm);

    return (
        <div>
            <TimePunchForm 
            showEditForm={showEditForm} 
            currentTimePunch={selectedTimePunch} 
            firebase={firebase}
            toggle={toggle}
            categoryId={categoryId}
            />
            <Row className="no-gutters mb-3 pb-2 border-bottom">
                <Col className="font-weight-bold">Date</Col>
                <Col className="font-weight-bold">Task</Col>
                <Col className="font-weight-bold">TimeIn</Col>
                <Col className="font-weight-bold">TimeOut</Col>
            </Row>
            {timePunches.map((timePunch, index) => {
                let totalTime = timePunch.totalTime;
                let totalMinutes = totalTime / 60000;
                let readableTime = "00:00";

                if (totalMinutes >= 1) {
                    readableTime = "00:" + totalMinutes;
                }

                return (
                    <TimePunchRow timePunch={timePunch} editTimePunch={editTimePunch} key={index} value={index}/>
                )
            })}

            {loading && <Spinner color="info" />}

        </div>
    );
}

export default TimePunchList