import React, { useEffect } from "react";
import Chart from "chart.js";

const Ch = ({ neighborhood }) => {
  const data = [
    ["bike theft", 12],
    ["car theft", 15],
    ["plane theft", 0.2],
    ["kidnapping", 63]
  ];
  data.sort((a, b) => {
    return b[1] - a[1];
  });
  useEffect(() => {
    new Chart(document.getElementById("bar-chart"), {
      type: "horizontalBar",
      data: {
        labels: data.map(d => d[0]),
        datasets: [
          {
            label: "percentage",
            backgroundColor: [
              "#3e95cd",
              "#8e5ea2",
              "#3cba9f",
              "#e8c3b9",
              "#c45850"
            ],
            data: data.map(d => d[1])
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: false
        }
      }
    });
  }, [data, neighborhood]);

  return <canvas id="bar-chart" width="800" height="450" />;
};

export default Ch;
