import React, { useState } from 'react';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';

const DashboardPage = ({ authUser, categoryId }) => {
    return (
        <div>
            <Dash authUser={authUser} categoryId={categoryId} />
        </div>
    )
};

const Dashboard = ({ authUser, firebase, categoryId }) => {

    // console.log("Form Props: ", props)
    const [state, setState] = useState({ date: "", timeIn: "", timeOut: "" });

    const handleChange = e => {

        const { name, value } = e.target;

        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log("State: ", state)
    };

    const createTimePunch = () => firebase.createTimePunch(categoryId).push({
        date: state.date,
        timeIn: state.timeIn,
        timeOut: state.timeOut,
    });

    return (
        <div>
            <FormGroup>
                <Label for="exampleDate">Date</Label>
                <Input
                    type="date"
                    name="date"
                    id="exampleDate"
                    placeholder="date placeholder"
                    onChange={handleChange}
                    value={state.date}


                />
            </FormGroup>
            <FormGroup>
                <Label for="exampleTime">Time In</Label>
                <Input
                    type="time"
                    name="timeIn"
                    id="exampleTime"
                    placeholder="time placeholder"
                    onChange={handleChange}
                    value={state.timeIn}


                />
            </FormGroup>
            <FormGroup>
                <Label for="exampleTime">Time Out</Label>
                <Input
                    type="time"
                    name="timeOut"
                    id="exampleTime"
                    placeholder="time placeholder"
                    onChange={handleChange}
                    value={state.timeOut}


                />
            </FormGroup>
            <FormGroup>
                <Label for="exampleText">Text Area</Label>
                <Input
                    type="textarea"
                    name="text"
                    id="exampleText"
                    onChange={handleChange}
                />
            </FormGroup>
         
            <select name="theme" id="cars" value={state.theme} onChange={handleChange}>
                <option value="success">success</option>
                <option value="info">info</option>
                <option value="warning">warning</option>
                <option value="danger">danger</option>
            </select>
            <button onClick={createTimePunch}>Click Me</button>
        </div>
    )
};


const condition = authUser => !!authUser;
const Dash = withFirebase(Dashboard);

export default withAuthorization(condition)(DashboardPage);