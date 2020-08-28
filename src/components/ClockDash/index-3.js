import React, { useState, useEffect } from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

import PunchClock from './PunchClock';
import TimePunchList from './TimePunchList';
import PieChart from './PieChart';

const ClockWrapper = ({ match }) => {
        const categoryId = match.params.id;
    return (
        <div style={{ width: `90%` }}>
            <ClockContainer categoryId={categoryId} />
        </div>
    )
};

const ClockDash = ({ categoryId, firebase }) => {

    const [punchClockList, setPunchList] = useState({});

    const [loading, setLoading] = useState({});


    useEffect(() => {

     
     
    });

    firebase.timePunches(categoryId).on('value', snapshot => {
        setLoading(true);
        const categoryObject = snapshot.val();
  
        if (categoryObject) {
          const timePunchesList = Object.keys(categoryObject).map(key => {
            return ({
              ...categoryObject[key],
              uid: key,
            })
          });
          timePunchesList.reverse();
          setPunchList(timePunchesList)
          setLoading(false)
        }
      })
    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <h1>Hello</h1>
                    <PieChart categoryId={categoryId}/>
                    <PunchClock categoryId={categoryId}/>
                    <TimePunchList categoryId={categoryId}/>
                </div>
            )}
        </AuthUserContext.Consumer>
    )
};

const condition = authUser => !!authUser;
const ClockContainer = withFirebase(ClockDash);

export default withAuthorization(condition)(ClockWrapper);