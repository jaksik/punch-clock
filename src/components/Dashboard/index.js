import React from 'react';
 
import { AuthUserContext, withAuthorization } from '../Session';
import CategoryList from './categoryList';
import CategoryForm from './categoryForm';

const DashboardPage = () => (
  <AuthUserContext.Consumer>
    {authUser => {
      console.log("AuthUse: ", authUser)
      return (
      <div>
        <CategoryList authUser={authUser}/>
      </div>
    )}}
  </AuthUserContext.Consumer>
);
 
const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(DashboardPage);