var ctx = document.getElementById('lineChart').getContext('2d');

//All of my basic data
var allData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Totals in $',
        // Sample monthly data
        data: [0, 0, 0, 0, 0, 0, 0, 2600, 2450, 1950, 2300, 2900],
        backgroundColor: 'rgba(85, 85, 85, 1)',
        borderColor: 'rgba(41, 155, 99)',
        borderWidth: 1
    }]
};

// Simulating fetching JSON data for septemberAmounts
var jsonData = `{
    "septemberAmounts": [
        0, -15, 100, -30, 60
    ]
}`;
//add after every .reduce iteration new total to array to keep track for chart (only if sabrina doesnt do whatt  she said)
var monthlyData = `{
    "monthlyAmounts": [
    ]
}`

// Parse the JSON data
var parsedData = JSON.parse(jsonData);
var septemberAmounts = parsedData.septemberAmounts;

//takes the daily earnings and sets it to the current months amount
const currentDate = new Date();
const currentMonth = currentDate.getMonth();

// Calculate the total earnings, automatically adding/subtracting based on the sign
totalEarnings = septemberAmounts.reduce((total, amount) => total + amount, 2900);

console.log(totalEarnings);

// Update the dataset for the current month
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

//pie charts
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
