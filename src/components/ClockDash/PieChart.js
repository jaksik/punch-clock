import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';

function PieChartComponent ({ timePunches}) {

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

    timePunches.map((timePunch, index) => {
      let taskObject = {
        title: timePunch.task,
        value: timePunch.totalTime,
        color: colorsArray[index],
      };

      if (pieChartArray.length === 0) {
        pieChartArray.push(taskObject);
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
        }
      }
    })

  return (
    <div>
      <PieChart
          data={pieChartArray}
          label={({ dataEntry }) => dataEntry.title}
          style={{ padding: `30px 80px 15px` }}
          // labelStyle={() => ({
          //   fontSize: '5px',
          //   fontFamily: 'sans-serif',
          // })}
          // radius={42}
          // labelPosition={112}
          // labelPosition={110}
          // labelStyle={defaultLabelStyle}
        />
    </div>
  );
}

export default PieChartComponent