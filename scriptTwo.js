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

    const regionData = Array.from(regionGDP, ([region, { avgHappiness, avgGDP }]) => ({ region, avgHappiness, avgGDP }));
    const tooltip = d3.select("#tooltip");

    const colors = ['steelblue', 'orange', 'mediumseagreen', 'crimson', 'purple', 'goldenrod', 'teal', 'sienna', 'orchid', 'cornflowerblue'];

    const svg = d3.select("#chartTwo")
        .append("svg")
        .attr("width", 1000)  //adjust the width and height to make the page larger
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(50,50)");

    const x = d3.scaleLinear()
        .domain([0, 1.5])
        .range([0, 700]);

    const y = d3.scaleLinear()
        .domain([0, 8])
        .range([200, 0]);

    svg.append("g")
        .attr("transform", "translate(0,200)")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -100)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("Average Happiness Score");
    
    svg.append("text")
        .attr("transform", "translate(350, 250)")
        .style("text-anchor", "middle")
        .text("Average GDP Per Capita");
    //tooltip creation refernces lecture week 8 events from cs416 Coursera 
    svg.selectAll(".dot")
        .data(regionData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.avgGDP))
        .attr("cy", d => y(d.avgHappiness))
        .attr("r", 5)
        .style("fill", (d, i) => colors[i])
        .on("mouseover", function(event,d){
        tooltip.style("opacity", 1)
        .style("left", (event.pageX)+"px")
        .style("top", (event.pageY)+"px")
        .html("Avg happiness: " + d.avgHappiness.toFixed(2) + "<br>" + "Avg GDP: " + d.avgGDP.toFixed(2) + "<br>" + "Region: " + d.region);
        })
        .on("mouseout", function(){tooltip.style("opacity", 0)});

    // Find the data point with the maximum happiness based on GDP
    const maxHappy = d3.max(regionData, d => d.avgHappiness);
    const maxHappyBox = regionData.find(d => d.avgHappiness === maxHappy);

    // Draw a rectangle around the dot with the highest happiness. I played with the box sizes to get the box correclty
    svg.append("rect")
        .attr("x", x(maxHappyBox.avgGDP)-9 )
        .attr("y", y(maxHappyBox.avgHappiness)-9)
        .attr("width", 17)
        .attr("height", 17)
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", 2);

    //legend
    svg.selectAll(".legend-dot")
        .data(regionData)
        .enter()
        .append("circle")
        .attr("class", "legend-dot")
        .attr("cx", 720)
        .attr("cy", function(d, i) {return 20 + i * 20})
        .attr("r", 7)
        .style("fill", function(d, i) {return colors[i]});

    svg.selectAll(".legend-label")
        .data(regionData)
        .enter()
        .append("text")
        .attr("class", "legend-label")
        .attr("x", 740)
        .attr("y", function(d, i) {return 20 +i* 20})
        .style("fill", function(d, i) {return colors[i]}) 
        .text(function(d,i){return (d.region)})
        .style("font-size", "12px"); 

    
}

secondChart();
