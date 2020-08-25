import React, { useState } from 'react';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Button } from 'reactstrap';
import ClockModal from "./clockModal";

const ClockComponent = ({ authUser, categoryId }) => {
    return (
        <div style={{width:`90%`}}>
            <Dash authUser={authUser} categoryId={categoryId} />
        </div>
    )
};

const Clock = ({ authUser, firebase, categoryId }) => {

    const [clockedIn, toggleClock] = useState(false);

    const [currentTime, updateTime] = useState("");

    const [timePunchId, updatePunchId] = useState("");

    const [clockOut, clockingOut] = useState(true);


    const punchClock = () => {
        let today = new Date();
        let date =  (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();

        let time = today.getHours() + ":" + today.getMinutes();
        console.log("Date: ", today)
        updateTime(time);
        if (!clockedIn) {
            //Clock In and create new time punch
            firebase.createTimePunch(categoryId).push({
                date: date,
                timeIn: time,
                timeOut: "",
            }).then((snap) => {
                console.log("Snap: ", snap.path.pieces_[3]);
                updatePunchId(snap.path.pieces_[3])
                toggleClock(true);
            });
        } else {
            //Clock out and update time punch
            toggleClock(false);
            firebase.updateTimePunch(categoryId, timePunchId).set(time)
            clockingOut(true)
            
        }
    }

    return (
        <div>
            <Button
            onClick={punchClock}
            color={(clockedIn ? "danger" : "success")}
            size="lg"
            block
            className="mt-3 mb-3 btn-block"
        >
            {(clockedIn ? "Clock Out" : "Clock In")}
        </Button>
        <ClockModal clockOut={clockOut} />
        </div>
    )
};


const condition = authUser => !!authUser;
const Dash = withFirebase(Clock);

export default withAuthorization(condition)(ClockComponent);