import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import TimePunchList from './List';
import PieChart from './PieChart';
import PunchClock from './PunchClock';
import { Row, Col } from 'reactstrap';

class DashboardComponent extends Component {
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
    };
  }

  componentDidMount() {
    console.log("PRops: ", this.props)
    this.setState({
      categoryId: this.props.match.params.id,
      loading: true
    });

    this.props.firebase.getCategory(this.props.authUser, this.props.match.params.id).on('value', snapshot => {
      const categoryInfo = snapshot.val();
      this.setState({ categoryInfo: categoryInfo })
      console.log("Cat Info: ", categoryInfo)
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
    this.props.firebase.getCategory().off();
    this.props.firebase.timePunches().off();
  }

  render() {
    const { timePunches, loading, categoryInfo, currentlyClockedIn, stillClockedIn } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => {
          return (
            <div>
              {/* <PieChart timePunches={timePunches} /> */}
              <PunchClock
                firebase={this.props.firebase}
                categoryId={this.state.categoryId}
                currentTimePunch={currentlyClockedIn}
                stillClockedIn={stillClockedIn}
              />
              <TimePunchList timePunches={timePunches} loading={loading} />
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