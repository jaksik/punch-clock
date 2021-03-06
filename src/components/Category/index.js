import React, { useState, useEffect } from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import ClockList from './clockList';

const DashboardPage = (props) => {

    const categoryId = props.match.params.id;

    useEffect(() => {
        // Update the document title using the browser API
        document.title = `You clicked  times`;
    });
    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <ClockList categoryId={categoryId}/>
                    {/* <ClockButton categoryId={categoryId}/> */}
                    {/* <ClockForm categoryId={categoryId}/> */}
                </div>
            )}
        </AuthUserContext.Consumer>
    )
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(DashboardPage);