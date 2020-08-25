import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { ListGroup, ListGroupItem, Table, Button } from 'reactstrap';
import { PieChart } from 'react-minimal-pie-chart';

class CategoryListComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            date: "",
            clockOn: false,
            timeIn: "",
            timeOut: "",
            timeElapsed: 0,
            readableTime: "",
        };
    }

    toggleClock = () => {
        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes();

        if (this.state.timeIn) {
            this.setState({
                clockOn: false,
                timeOut: time,
            }, this.showTime);

        } else {
            this.setState({
                clockOn: true,
                timeIn: time,
            }, this.createTimePunch);

            // setInterval(() => {
            //     console.log("Hello");

            //     this.setState({ timeElapsed: Date.now() })
            // }, 1000)
        }
    }

    createTimePunch = () => this.props.firebase.createTimePunch(this.props.categoryId).push({
        date: this.state.date,
        timeIn: this.state.timeIn,
        timeOut: this.state.timeOut,
    }).then((snap, error) => {
        console.log("Snap: ", snap);
        console.log("error: ", error)
    });

    showTime = () => {
        let elapsedTime = Math.floor((this.state.timeOut - this.state.timeIn) / 1000);
        console.log("Elapsed Time: ", elapsedTime);
    }

    //time stamp in
    //time stamp out
    //readable time in
    //readable time out
    //date

    render() {
        const { timePunches, loading, categoryInfo } = this.state;

        return (
            <div>

                <p>{this.state.time}</p>
                <p>Time Elapsed: {this.state.timeElapsed}</p>
                <p>{this.state.readableTime}</p>
                <Button color="success" onClick={this.toggleClock}>Clock In</Button>
                {loading && <div>Loading ...</div>}

            </div>
        );
    }
}


const condition = authUser => !!authUser;


export default compose(
    withAuthorization(condition),
    withFirebase,
)(CategoryListComponent);;