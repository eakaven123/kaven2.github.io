async function firstChart() {
    console.log("hi");
    const data = await d3.csv("https://raw.githubusercontent.com/eakaven123/kaven2.github.io/main/2015.csv");
    console.log(data[1]);
    console.log(data[2]);
}

//this specifies where you want the page to go to when the button is clicked from the first page to firstcharthtml page. page1->page2. this is called in index.html when button is clicked
function secondPage() {
    window.location.href = "firstchart.html";
}

firstChart();
