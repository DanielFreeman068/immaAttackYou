var ctx = document.getElementById('lineChart').getContext('2d');

//All of my basic data
var allData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Earnings in $',
        // Sample monthly data
        data: [2050, 1900, 2100, 1800, 2800, 2000, 2500, 2600, 2450, 1950, 2300, 2900],
        backgroundColor: 'rgba(85, 85, 85, 1)',
        borderColor: 'rgba(41, 155, 99)',
        borderWidth: 1
    }]
};

// Simulating fetching JSON data for septemberAmounts
var jsonData = `{
    "septemberAmounts": [
        100, 120, 150, 100, 230, 170, 300, 190, 250, 210, 
        280, 240, 200, 260, 265, 280, 240, 300, 210, 230, 
        230, 340, 150, 140, 260, 180, 190, 230, 210, 420
    ]
}`;

// Parse the JSON data
var parsedData = JSON.parse(jsonData);
var septemberAmounts = parsedData.septemberAmounts;

//takes the daily earnings and sets it to the current months amount
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const totalEarnings = septemberAmounts.reduce((total, septemberAmounts) => total + septemberAmounts, 0);
allData.datasets[0].data[currentMonth] = totalEarnings;

//uses allData for a chart where plugins - tooltip customizes the behavior of the tooltip and the callback function is executed when tooltip is displayed
var myChart = new Chart(ctx, {
    type: 'line',
    data: allData,
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        const currentEarnings = tooltipItem.raw;
                        const previousEarnings = getPreviousEarnings(tooltipItem.label);//tool tip item contains info on the current hovered point. tooltipitem.raw is just the data which in this case is the dollar amount
                        const difference = currentEarnings - previousEarnings;
                        return [
                            `Earnings: $${currentEarnings}`,
                            `Difference: $${difference >= 0 ? '+' : ''}${difference}`
                        ];
                    }
                }
            }
        }
    }
});

// Function to filter data based on time frame
function filterData(timeFrame) {
    let filteredLabels = [];
    let filteredData = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    switch (timeFrame) {
        case 'last_12_months':
            // this gets the last 12 months by index and adds 12 so that it doesnt go below 0 which one be invalid and the modulus 12 enforces it to be under 12
            for (let i = 0; i < 12; i++) {
                const monthIndex = (currentMonth - i + 12) % 12;
                filteredLabels.unshift(allData.labels[monthIndex]);
                filteredData.unshift(allData.datasets[0].data[monthIndex]);
            }
            break;
            // this gets the last 6 months by index and adds 12 so that it doesnt go below 0 which one be invalid and the modulus 12 enforces it to be under 12
        case 'last_6_months':
            for (let i = 0; i < 6; i++) {
                const monthIndex = (currentMonth - i + 12) % 12;
                filteredLabels.unshift(allData.labels[monthIndex]);
                filteredData.unshift(allData.datasets[0].data[monthIndex]);
            }
            break;
        case 'last_1_month':
            //uses new Date() to get the exact month based on the year to find out how many days are in each month and then uses a mapping function to display daily balances off of the index of the filtered data
            const year = currentDate.getFullYear();
            const month = [];
            month.push(allData.labels[currentMonth]);
            const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
            filteredLabels = Array.from({ length: daysInMonth }, (_, index) => `${month} ${index + 1}`);
            filteredData = septemberAmounts.slice(0, daysInMonth);
            break;  
    }

    // Update the chart with filtered data
    myChart.data.labels = filteredLabels;
    myChart.data.datasets[0].data = filteredData;
    myChart.update();
}

// Function to get previous earnings based on the current label
function getPreviousEarnings(currentLabel) {
    const index = allData.labels.indexOf(currentLabel);
    if (index > 0) {
        return allData.datasets[0].data[index - 1];
    }
    return 0;
}

filterData('last_1_month');



// var ctx = document.getElementById('lineChart').getContext('2d');
// var myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//         datasets: [{
//             label: 'Earnings in $',
//             data: [2050, 1900, 2100, 1800, 2800, 2000, 2500, 2600, 2450, 1950, 2300, 2900],
//             backgroundColor: [
//                 'rgba(85, 85, 85, 1)'
//             ],
//             borderColor: [
//                 'rgba(41, 155, 99)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         responsive: true
//     }
// });

// function updateChart(newEarnings, newMonth) {
//     myChart.data.labels.shift();
//     myChart.data.datasets[0].data.shift();

//     myChart.data.labels.push(newMonth);
//     myChart.data.datasets[0].data.push(newEarnings);

//     myChart.update();
// }

// updateChart(3100, 'Jan');


// const Utils = {
//     CHART_COLORS: {
//     red: 'rgb(255, 99, 132)',
//     blue: 'rgb(54, 162, 235)',
//     },
//     transparentize: function(color, opacity) {
//     const alpha = opacity || 0.5;
//     return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
//     }
// };

// const actions = [
//     {
//     name: 'Update Chart',
//     handler(chart) {
//         chart.update();
//     }
//     }
// ];

// const DATA_COUNT = 12;

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septermber', 'October', 'November', 'December'];

// const data = {
//     labels: labels,
//     datasets: [
//     {
//         label: 'Income',
//         data: [3000, 3200, 2500, 4000, 3700, 4500, 4200, 4800, 4600, 5000, 5300, 4900],
//         borderColor: Utils.CHART_COLORS.red,
//         backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
//         yAxisID: 'y',
//     },
//     {
//         label: 'Expenses',
//         data: [2000, 1800, 2200, 2700, 2600, 2400, 2300, 2900, 3100, 3400, 3000, 2800],
//         borderColor: Utils.CHART_COLORS.blue,
//         backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
//         yAxisID: 'y1',
//     }
//     ]
// };

// const config = {
//     type: 'line',
//     data: data,
//     options: {
//     responsive: true,
//     interaction: {
//         mode: 'index',
//         intersect: false,
//     },
//     stacked: false,
//     plugins: {
//         title: {
//         display: true,
//         text: 'Income vs Expenses Over Time'
//         }
//     },
//     scales: {
//         y: {
//         type: 'linear',
//         display: true,
//         position: 'left',
//         },
//         y1: {
//         type: 'linear',
//         display: true,
//         position: 'right',
//         grid: {
//             drawOnChartArea: false,
//         },
//         },
//     }
//     },
// };

// window.onload = function() {
//     var ctx = document.getElementById('myChart').getContext('2d');
//     new Chart(ctx, config);
// };

// document.addEventListener("DOMContentLoaded", showPieChart);

// // Defining the slices with sizes and colors
// let sliceA = { size: 400, color: 'limegreen', label: 'Home & Utilities' };
// let sliceB = { size: 150, color: 'green', label: 'Transportation' };
// let sliceC = { size: 250, color: 'darkgreen', label: 'Groceries' };
// let sliceD = { size: 180, color: 'darkolivegreen', label: 'Health' };
// let sliceE = { size: 220, color: 'yellow', label: 'Restaurants & Dining' };
// let sliceF = { size: 300, color: 'orange', label: 'Shopping & Entertainment' };
// let sliceG = { size: 120, color: 'chocolate', label: 'Cash, Checks & Misc' };

// function showPieChart() {
//     console.log("pie-chart on load");

//     let slices = [sliceA, sliceB, sliceC, sliceD, sliceE, sliceF, sliceG];
    
//     const total = slices.reduce((acc, slice) => acc + slice.size, 0); //this gets all the sizes total amount
//     let startAngle = 0;

//     const canvas = document.getElementById('pie-chart');
//     const ctx = canvas.getContext('2d');

//     // Loop through slices and draw each one
//     slices.forEach((slice) => {
//         const angle = (slice.size / total) * Math.PI * 2;

//         // Draw the slice
//         ctx.beginPath();
//         ctx.moveTo(canvas.width / 2, canvas.height / 2);//moves cursor to center since its a pie
//         ctx.arc(
//             canvas.width / 2,
//             canvas.height / 2,
//             canvas.width / 2,
//             startAngle,
//             startAngle + angle
//         );
//         ctx.closePath();
//         ctx.fillStyle = slice.color;
//         ctx.fill();

//         startAngle += angle;
//     });

//     //map function to make divs to dynamically render each slices color and stats
//     const legend = document.getElementById('pie-chart-legend');
//     legend.innerHTML = slices.map(slice => `
//         <div class="legend-item">
//             <div class="legend-color" style="background-color:${slice.color}"></div>
//             <div class="legend-label">${slice.label}: $${slice.size} - ${((slice.size / total) * 100).toFixed(2)}%</div>
//         </div>
//     `).join('');
// }
// //function to add amount THIS IS FOR TESTING
// function addAmount(slice, amount) {
//     slice.size += amount;
//     showPieChart();
// }

// // Example of adding an amount
// // addAmount(sliceC, 1000);

document.addEventListener("DOMContentLoaded", () => {
    showPieChart('pie-chart-1', slicesSet1);
    showPieChart('pie-chart-2', slicesSet2);
});

// Define slices for the first pie chart
let slicesSet1 = [
    { size: 400, color: 'limegreen', label: 'Home & Utilities' },
    { size: 150, color: 'green', label: 'Transportation' },
    { size: 250, color: 'darkgreen', label: 'Groceries' },
    { size: 180, color: 'darkolivegreen', label: 'Health' },
    { size: 220, color: 'yellow', label: 'Restaurants & Dining' },
    { size: 300, color: 'orange', label: 'Shopping & Entertainment' },
    { size: 120, color: 'chocolate', label: 'Cash, Checks & Misc' }
];

// Define slices for the second pie chart
let slicesSet2 = [
    { size: 180, color: 'cornflowerblue', label: 'Payroll' },
    { size: 220, color: 'lightblue', label: 'Checks/Misc' },
    { size: 300, color: 'cadetblue', label: 'Other' },
];

function showPieChart(canvasId, slices) {
    console.log(`Drawing pie chart for ${canvasId}`);

    const total = slices.reduce((acc, slice) => acc + slice.size, 0);
    let startAngle = 0;

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    // Loop through slices and draw each one
    slices.forEach((slice) => {
        const angle = (slice.size / total) * Math.PI * 2;

        // Draw the slice
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2,
            startAngle,
            startAngle + angle
        );
        ctx.closePath();
        ctx.fillStyle = slice.color;
        ctx.fill();

        startAngle += angle;
    });

    // Create legend for the pie chart
    const legend = document.getElementById(canvasId + '-legend');
    legend.innerHTML = slices.map(slice => `
        <div class="legend-item">
            <div class="legend-color" style="background-color:${slice.color}"></div>
            <div class="legend-label">${slice.label}: $${slice.size} - ${((slice.size / total) * 100).toFixed(2)}%</div>
        </div>
    `).join('');
}

// Function to add amount for testing
function addAmount(slice, amount) {
    slice.size += amount;
    showPieChart('pie-chart-1', slicesSet1); // Update first chart
    showPieChart('pie-chart-2', slicesSet2); // Update second chart
}

// Example of adding an amount
// addAmount(slicesSet1[0], 1000);
