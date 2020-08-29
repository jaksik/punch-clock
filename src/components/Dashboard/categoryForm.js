import React, { useState } from 'react';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

const DashboardPage = ({ authUser }) => {
    return (
        <div>
            <Dash authUser={authUser} />
        </div>
    )
};

const Dashboard = ({ authUser, firebase }) => {

    // console.log("Form Props: ", props)
    const [state, setState] = useState({ name: "", uid: "", theme: "success" });

    const handleChange = e => {

        const { name, value } = e.target;

        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log("State: ", state)
    };

    const createCategory = () => firebase.createCategory(authUser.uid).push({
        name: state.name,
        userId: authUser.uid,
        theme: state.theme,
    });

    return (
        <div>
            <input
                value={state.name}
                type="text"
                onChange={handleChange}
                name="name"
            />
            <select name="theme" id="cars" value={state.theme} onChange={handleChange}>
                <option value="success">success</option>
                <option value="info">info</option>
                <option value="warning">warning</option>
                <option value="danger">danger</option>
            </select>
            <button onClick={createCategory}>Click Me</button>
        </div>
    )
};


const condition = authUser => !!authUser;
const Dash = withFirebase(Dashboard);

export default withAuthorization(condition)(DashboardPage);