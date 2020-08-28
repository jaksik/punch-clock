import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import Dashboard from './Dashboard';

const DashboardPage = (props) => {

    const categoryId = props.match.params.id;

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <Dashboard categoryId={categoryId}/>
                    {/* <ClockButton categoryId={categoryId}/> */}
                    {/* <ClockForm categoryId={categoryId}/> */}
                </div>
            )}
        </AuthUserContext.Consumer>
    )
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(DashboardPage);