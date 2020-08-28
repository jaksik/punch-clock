import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import TimePunchList from './List';
import PieChart from './PieChart';
import PunchClock from './PunchClock';

class DashboardComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      timePunches: [],
      categoryInfo: {},
      pieChartData: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.getCategory(this.props.categoryId).on('value', snapshot => {
      const categoryInfo = snapshot.val();
      this.setState({ categoryInfo: categoryInfo })
    });

    this.props.firebase.timePunches(this.props.categoryId).on('value', snapshot => {
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
        })
      }
    })
  }

  componentWillUnmount() {
    this.props.firebase.categories().off();
  }

  render() {
    const { timePunches, loading, categoryInfo } = this.state;

    return (
      <div>        
        <PieChart timePunches={timePunches}/>
        <PunchClock/>
        <TimePunchList timePunches={timePunches} loading={loading} />
      </div>
    );
  }
}

const condition = authUser => !!authUser;


export default compose(
  withAuthorization(condition),
  withFirebase,
)(DashboardComponent);;