import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'reactstrap'

function TimePunchList({ timePunches, loading }) {


    return (
        <div>
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
                        )
                    })}

                </tbody>
            </Table>
            {loading && <Spinner color="info" />}

        </div>
    );
}

export default TimePunchList