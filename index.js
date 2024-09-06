import fetchAndCreateChart from "./chart.js";
// import {st} from "./charts"
let st = "AAPL";
fetchAndCreateChart('5y',st);

export async function getStocks(symbol){
const url = `https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata`;
try {
  const response = await fetch(url);
  const result = await response.json();
  console.log();
  const stocksummary = document.querySelector('#summary');
  stocksummary.querySelector('p').textContent = result.stocksProfileData[0][symbol].summary;
} catch (error) {
  console.error(error);
}
}
export async function getStats(symbol){
const url = `https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata`;

try {
  const response = await fetch(url);
  const result = await response.json();
  const bookValue = result.stocksStatsData[0][symbol].bookValue;
  const profit = result.stocksStatsData[0][symbol].profit;
  const stocksummary = document.querySelector('#summary');
stocksummary.querySelector('#name').textContent = symbol;
  const Profit = document.getElementById("profit")
  Profit.textContent = `${profit}%`;
  if (profit > 0) {
    Profit.setAttribute('style', 'color: green');
  } else {
    Profit.setAttribute('style', 'color: red');
  }
  document.getElementById("bookValue").textContent = `$${bookValue}`;

} catch (error) {
  console.error(error);
}
}

async function getStatusinList(symbol){
const url = `https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata`;
let bookValue;
let profit;
try {
  const response = await fetch(url);
  const result = await response.json();
  // console.log(result.stocksStatsData[0]);
  bookValue = result.stocksStatsData[0][symbol].bookValue;
  profit = result.stocksStatsData[0][symbol].profit;
} catch (error) {
  console.error(error);
}
  return {bookValue,profit};
}

async function renderList(){
const list = ['AAPL' ,'MSFT' ,'GOOGL' ,'AMZN' ,'PYPL' ,'TSLA' ,'JPM' ,'NVDA', 'NFLX', 'DIS'];
const listEl = document.getElementById('stock-list');

for (const stock of list) {
const { bookValue, profit } = await getStatusinList(stock);
const list_item = document.createElement("div");
const name = document.createElement('button');
name.classList.add('list');
const bookV = document.createElement('span');
const proft = document.createElement('span');
if (profit > 0) {
      proft.setAttribute('style', 'color: #90EE90');
    } else {
      proft.setAttribute('style', 'color: red');
    }
list_item.classList.add('list_i');
name.textContent = stock;
name.value = stock;
bookV.textContent = `$${bookValue}`;
proft.textContent = `${profit.toFixed(2)}%`;

list_item.append(name, bookV, proft);
listEl.append(list_item);
name.addEventListener('click',(e)=>{
fetchAndCreateChart('5y',stock)
})
}
}
renderList();