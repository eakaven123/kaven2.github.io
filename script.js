async function firstChart() {
    //data is loaded
    console.log("hi");
    const data = await d3.csv("https://raw.githubusercontent.com/eakaven123/kaven2.github.io/main/2015.csv");
    console.log(data[1]);
}

firstChart();
