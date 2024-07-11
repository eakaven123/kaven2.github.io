async function secondChart() {
    const data = await d3.csv("https://raw.githubusercontent.com/eakaven123/kaven2.github.io/main/2015.csv");

    const regionGDP = d3.rollup(
        data,
        v => ({
            avgHappiness: d3.mean(v, d => +d["Happiness Score"]),
            avgGDP: d3.mean(v, d => +d["Economy (GDP per Capita)"])
        }),
        d => d.Region
    );
    //for each region there needs to be an average happines and avg gdp
    const regionData = Array.from(regionGDP, ([region, { avgHappiness, avgGDP }]) => ({ region, avgHappiness, avgGDP }));

    //found these colors through search
    const colors = ['steelblue', 'orange', 'mediumseagreen', 'crimson', 'purple', 'goldenrod', 'teal', 'sienna', 'orchid', 'cornflowerblue']

    const svg = d3.select("#chartTwo")
        .append("svg")
        .attr("width", 800)
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(50,50)");

    const x = d3.scaleLinear()
        .domain([0, 1.4])
        .range([0, 700]);

    const y = d3.scaleLinear()
        .domain([0, 8])
        .range([200, 0]);

    svg.append("g")
        .attr("transform", "translate(0,200)")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

//referenced the lecture videos on pie chart
    svg.selectAll(".dot")
        .data(regionData)
        .enter()
        .append("circle")
        .attr("cx", function(d,i) {return x(d.avgGDP);})
        .attr("cy", function(d,i) {return y(d.avgHappiness);})
        .attr("r", 5)
        .style("fill", function(d,i) {return colors[i];})
}



secondChart();
