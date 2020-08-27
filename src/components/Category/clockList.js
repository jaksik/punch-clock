import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { ListGroup, ListGroupItem, Table, Row, Col, Spinner } from 'reactstrap';
import { PieChart } from 'react-minimal-pie-chart';
import Clock from './clock';

class CategoryListComponent extends Component {
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
          })
        });
        timePunchesList.reverse();
        this.setState({
          timePunches: timePunchesList,
          loading: false,
        }, () => {
          this.createPieChart();
        })
      }
    })
  }


  componentWillUnmount() {
    this.props.firebase.categories().off();
  }

  createPieChart() {
    //Fill Pie Chart State Array
    //Loop through timePunchList Array
    //Make an object for each task and push it to the array
    let colorsArray = [
      "#E38627",
      "#C13C37",
      "#6A2135",
      "#0000ff",
      "#00ff16",
      "#6A2135",
      "#E38627",
      "#C13C37",
      "#6A2135",
      "#E38627",
      "#C13C37",
      "#6A2135",
    ];

    let pieChartArray = [];

    this.state.timePunches.map((timePunch, index) => {
      let taskObject = {
        title: timePunch.task,
        value: timePunch.totalTime,
        color: colorsArray[index],
      };

      if (pieChartArray.length === 0) {
        pieChartArray.push(taskObject);
        console.log("Push Object: ", pieChartArray);
      } else {
        let itemsMatch = false;
        pieChartArray.map((pieChartArrayTask, i) => {
          if (!itemsMatch && pieChartArrayTask.title === timePunch.task) {
            itemsMatch = true;
            let taskTotalTime = pieChartArrayTask.value + timePunch.totalTime;
            pieChartArray[i].value = taskTotalTime;
          }
        })
        if (!itemsMatch) {
          pieChartArray.map((pieChartArrayTaskColor, ind) => {
            colorsArray.map((color, colorIndex) => {
              if (color !== pieChartArrayTaskColor.color) {
                taskObject.color = color;
              }
            })
          })
          pieChartArray.push(taskObject);
          console.log("Push Object: ", pieChartArray);
        }
      }

      //Map through all Time Punches
      //for each time punch map through pie chart array and see if timePunchTitle == pieChartArray[*].title
      //if titles match then add timePunchTotal to pieChartArray[*].total
      //else push the new timePunch to the pieChartArray
    })
    this.setState({ pieChartData: pieChartArray })
  }

  render() {
    const { timePunches, loading, categoryInfo } = this.state;
    const defaultLabelStyle = {
      fill: 'white',
      fontSize: '5px',
      fontFamily: 'sans-serif',
    };
    return (
      <div>
        <h1 style={{ textAlign: `center` }}>{categoryInfo.name}</h1>
        <PieChart
          data={this.state.pieChartData}
          label={({ dataEntry }) => dataEntry.title}
          style={{ padding: `30px 80px 15px` }}
          // labelStyle={() => ({
          //   fontSize: '5px',
          //   fontFamily: 'sans-serif',
          // })}
          // radius={42}
          // labelPosition={112}
          // labelPosition={110}
          labelStyle={defaultLabelStyle}
        />
        <p style={{ textAlign: `center` }}>27 Hours this week</p>
        <Row className="no-gutters">
          <Col className="d-flex justify-content-center" xs={12}>
            <Clock categoryId={this.props.categoryId} />
          </Col>
        </Row>
        <CategoryList timePunches={timePunches} />
        {loading && <Spinner color="info" />}

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
      {timePunches.map(timePunch => {
        let totalTime = timePunch.totalTime;
        let totalMinutes = totalTime / 60000;
        let readableTime = "00:00";

        if (totalMinutes >= 1) {
          readableTime = "00:" + totalMinutes;
        }

        return (
        <tr key={timePunch.uid} color={timePunch.theme}>
          <td>{timePunch.date}</td>
          <td>{timePunch.task}</td>
          <td>{readableTime}</td>
        </tr>
      )})}

    </tbody>
  </Table>
);

const condition = authUser => !!authUser;


export default compose(
  withAuthorization(condition),
  withFirebase,
)(CategoryListComponent);;