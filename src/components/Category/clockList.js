import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { ListGroup, ListGroupItem, Table, Row, Col } from 'reactstrap';
import { PieChart } from 'react-minimal-pie-chart';
import Clock from './clock';

class CategoryListComponent extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      loading: false,
      timePunches: [],
      categoryInfo: {},
    };
  }
 
  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.getCategory(this.props.categoryId).on('value', snapshot => {
      const categoryInfo = snapshot.val();
      this.setState({
        categoryInfo: categoryInfo,
      })
    });
 
    this.props.firebase.timePunches(this.props.categoryId).on('value', snapshot => {
      const categoryObject = snapshot.val();

      if (categoryObject) {
        const timePunchesList = Object.keys(categoryObject).map(key => {
          return ({
          ...categoryObject[key],
          uid: key,
        })});
        timePunchesList.reverse();
        this.setState({
          timePunches: timePunchesList,
        });
      }
    
      this.setState({
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.categories().off();
  }
 
  render() {
    const { timePunches, loading, categoryInfo } = this.state;
 
    return (
      <div>
        <h1 style={{textAlign:`center`}}>{categoryInfo.name}</h1>
          <PieChart
                data={[
                    { title: 'One', value: 10, color: '#E38627' },
                    { title: 'Two', value: 15, color: '#C13C37' },
                    { title: 'Three', value: 20, color: '#6A2135' },
                ]}
                label={({ dataEntry }) => dataEntry.title}
                style={{ padding: `30px 80px 15px` }}
            />
        <p style={{textAlign:`center`}}>27 Hours this week</p>
        {loading && <div>Loading ...</div>}
        <Row className="no-gutters">
          <Col className="d-flex justify-content-center" xs={12}>
            <Clock categoryId={this.props.categoryId}/>
          </Col>
        </Row>
        <CategoryList timePunches={timePunches}/>
      </div>
    );
  }
}

const CategoryList = ({ timePunches }) => (
  <Table>
     <thead>
        <tr>
          <th>Date</th>
          <th>Task</th>
          <th>Total</th>
        </tr>
      </thead>
    <tbody>
    {timePunches.map(timePunch => (
      <tr key={timePunch.uid} color={timePunch.theme}>
        <td>{timePunch.date}</td>
        <td>{timePunch.timeIn}</td>
        <td>{timePunch.timeOut}</td>
      </tr>
    ))}
    </tbody>
  </Table>
);
 
const condition = authUser => !!authUser;

 
export default compose(
  withAuthorization(condition),
  withFirebase,
)(CategoryListComponent);;