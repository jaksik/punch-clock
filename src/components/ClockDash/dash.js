import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import TimePunchList from './List';
import PieChart from './PieChart';
import PunchClock from './PunchClock';
import CatForm from './CatForm';
import { auth } from 'firebase';

class DashboardComponent extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      timePunches: [],
      categoryInfo: {},
      pieChartData: [],
      categoryId: '',
      userId: '',
      currentlyClockedIn: {},
      stillClockedIn: false,
      redirect: false,
    };
  }


  componentDidMount() {
    this._isMounted = true;

    this.setState({
      categoryId: this.props.match.params.id,
      loading: true
    });

    this.props.firebase.getCategory(this.props.authUser, this.props.match.params.id).on('value', snapshot => {
      const categoryInfo = snapshot.val();
      if (categoryInfo == null) {
        this.setState({ redirect: true })
      } else {
        this.setState({ categoryInfo: categoryInfo })
      }
    });

    this.props.firebase.timePunches(this.props.match.params.id).on('value', snapshot => {
      const categoryObject = snapshot.val();
      if (categoryObject) {
        const timePunchesList = Object.keys(categoryObject).map(key => {
          return ({
            ...categoryObject[key],
            uid: key,
          })
        });
        timePunchesList.reverse();
        this.setState({
          timePunches: timePunchesList,
          loading: false,
        }, () => {
          if (timePunchesList[0] && timePunchesList[0].timeOut == "") {
            this.setState({
              currentlyClockedIn: timePunchesList[0],
              stillClockedIn: true,
            })
          } else {
            this.setState({ stillClockedIn: false })
          }
        });
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.firebase.getCategory().off();
    this.props.firebase.timePunches().off();
    this.props.firebase.editCategory().off();
  }

  render() {
    const { timePunches, loading, categoryInfo, currentlyClockedIn, stillClockedIn, categoryId } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => {
          return (
            <div>
              <CatForm categoryInfo={categoryInfo} firebase={this.props.firebase} categoryId={categoryId} />
              <h1 className="text-center">{categoryInfo.name || ""}</h1>
              {/* <PieChart timePunches={timePunches} /> */}
              <PunchClock
                firebase={this.props.firebase}
                categoryId={this.state.categoryId}
                currentTimePunch={currentlyClockedIn}
                stillClockedIn={stillClockedIn}
              />
              <TimePunchList 
                              categoryId={this.state.categoryId}
              timePunches={timePunches} firebase={this.props.firebase} loading={loading} />
            </div>
          )
        }}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => !!authUser;


export default compose(
  withAuthorization(condition),
  withFirebase,
)(DashboardComponent);;