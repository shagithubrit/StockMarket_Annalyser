// export let st = "AAPL"
import {getStocks,getStats}  from "./index.js"
let st;
export default async function fetchAndCreateChart(range = "5y",symbol ="AMRN") {

    const url = `https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata`;

    st = symbol;
    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);
      // consoele.log("hello");
      // console.log(result.stocksData[0].AAPL)
      let chartData = result.stocksData[0][st][range].value;
      let labels = result.stocksData[0][st][range].timeStamp;
      
      labels = labels.map((timestamp) => new Date(timestamp * 1000).toLocaleDateString());
      drawChart(chartData, labels, st);
      getStocks(st);
      getStats(st);
    } catch (error) {
      console.error(error);
    }

  }

  const onedaybtn = document.getElementById("btn1d");
  const onemonbtn = document.getElementById("btn1mo");
  const oneyrbtn = document.getElementById("btn1y");
  const fiveyrbtn = document.getElementById("btn5y");

  onedaybtn.addEventListener('click',()=>{
    fetchAndCreateChart("1mo",st);
  })
  onemonbtn.addEventListener('click',()=>{
    fetchAndCreateChart("3mo",st);
  })
  oneyrbtn.addEventListener('click',()=>{
    fetchAndCreateChart("1y",st);
  })
  fiveyrbtn.addEventListener('click',()=>{
    fetchAndCreateChart("5y",st);
  })

  // Function to draw the chart on the canvas
  function drawChart(data, labels, stockName) {
    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');
    const chartHeight = canvas.height - 40;
    const chartWidth = canvas.width - 60;
    const dataMax = Math.max(...data);
    const dataMin = Math.min(...data);
    const dataRange = dataMax - dataMin;
    const dataStep = dataRange > 0 ? chartHeight / dataRange : 0;
    const stepX = chartWidth / (data.length - 1);
  
    // Clear the canvas at the beginning
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the chart
    ctx.beginPath();
    ctx.moveTo(0, chartHeight - (data[0] - dataMin) * dataStep);
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(i * stepX, chartHeight - (data[i] - dataMin) * dataStep);
    }
    ctx.strokeStyle = '#39FF14';
    ctx.lineWidth = 2;
    ctx.stroke();
  
    // Draw a dotted horizontal line for value 0
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    const zeroY = chartHeight - (0 - dataMin) * dataStep;
    ctx.moveTo(0, zeroY);
    ctx.lineTo(canvas.width, zeroY);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
    ctx.setLineDash([]); // Reset the line dash
  
    // Show tooltip and x-axis value on hover
    const tooltip = document.getElementById('tooltip');
    const xAxisLabel = document.getElementById('xAxisLabel');
  
    canvas.addEventListener('mousemove', (event) => {
      const x = event.offsetX;
      const y = event.offsetY;
      const dataIndex = Math.min(Math.floor(x / stepX), data.length - 1); // Ensure not to go out of bounds
      const stockValue = data[dataIndex].toFixed(2);
      const xAxisValue = labels[dataIndex];
  
      tooltip.style.display = 'block';
      tooltip.style.left = `${x + 10}px`;
      tooltip.style.top = `${y - 20}px`;
      tooltip.textContent = `${stockName}: $${stockValue}`;
  
      xAxisLabel.style.display = 'block';
      xAxisLabel.style.fontSize = '14px';
      xAxisLabel.style.fontWeight = 'bolder';   
      xAxisLabel.style.left = `${x}px`;
      xAxisLabel.textContent = xAxisValue;
  
      // Clear the canvas except for the vertical line and data point
      ctx.clearRect(0, 0, canvas.width, chartHeight);
      ctx.clearRect(0, chartHeight + 20, canvas.width, canvas.height - chartHeight - 20);
  
      // Draw the chart
      ctx.beginPath();
      ctx.moveTo(0, chartHeight - (data[0] - dataMin) * dataStep);
      for (let i = 1; i < data.length; i++) {
        ctx.lineTo(i * stepX, chartHeight - (data[i] - dataMin) * dataStep);
      }
      ctx.strokeStyle = '#39FF14';
      ctx.lineWidth = 2;
      ctx.stroke();
  
      // Draw the dotted horizontal line for value 0
      ctx.beginPath();
      ctx.setLineDash([2, 2]);
      ctx.moveTo(0, zeroY);
      ctx.lineTo(canvas.width, zeroY);
      ctx.strokeStyle = '#ccc';
      ctx.stroke();
      ctx.setLineDash([]); // Reset the line dash
  
      // Draw a vertical line at the current x position when hovering over the chart
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, chartHeight);
      ctx.strokeStyle = '#ccc';
      ctx.stroke();
  
      // Draw the data point as a bolder ball
      ctx.beginPath();
      ctx.arc(x, chartHeight - (data[dataIndex] - dataMin) * dataStep, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#39FF14';
      ctx.fill();
    });
  
    canvas.addEventListener('mouseout', () => {
      tooltip.style.display = 'none';
      xAxisLabel.style.display = 'none';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawChart(data, labels, stockName);
    });

  }
  