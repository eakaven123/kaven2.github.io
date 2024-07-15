scatterplot();


async function scatterplot() {
    const data = await d3.csv("https://raw.githubusercontent.com/eakaven123/kaven2.github.io/main/2015.csv");

    const formattedData = data.map(d => ({
        happiness: parseFloat(d['Happiness Score']),
        family: parseFloat(d['Family']),
        Country: d['Country'],
        Region: d['Region'] 
        
    }));

    const tooltip = d3.select("#tooltipTwo");



    const svg = d3.select("#chartThree")
        .append("svg")
        .attr("width", 660)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(40,20)");

    const x = d3.scaleLinear()
        .domain([0, 1.5])
        .range([0, 550])
       

    const y = d3.scaleLinear()
        .domain([0,8])
        .range([350, 0])
        

    svg.append("g")
        .attr("transform", "translate(0,350)")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    const dots = svg.selectAll(".dot")
        .data(formattedData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.family))
        .attr("cy", d => y(d.happiness))
        .attr("r", 5)
        .style("fill", "steelblue")
        .on("mouseover", function(event,d){
            tooltip.style("opacity", 1)
            .style("left", (event.pageX)+"px")
            .style("top", (event.pageY)+"px")
            .html("Happiness: " + d.happiness.toFixed(2) + "<br>" + "Family: " + d.family.toFixed(2) + "<br>" + "Country: " + d.Country);
            })
            .on("mouseout", function(){tooltip.style("opacity", 0)});
        
//y label
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -175)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Happiness Score");

    //x label
svg.append("text")
    .attr("transform", "translate(270, 380)")
    .style("text-anchor", "middle")
    .text("Family Score");

   

    function updatePlot(region) {
        if (region === "All") {
            filteredData = formattedData;
        } else {
            filteredData = formattedData.filter(d => d.Region === region); 
        }

        
        const dot_update = svg.selectAll(".dot")
            .data(filteredData, d => d.Country);

        dot_update.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d,i) {return x(d.family)})
        .attr("cy", function(d,i){return y(d.happiness)})
        .attr("r", 5)
        .style("fill", "steelblue")
        .merge(dot_update)
        .attr("cx", d => x(d.family))
        .attr("cy", d => y(d.happiness));

        //https://www.geeksforgeeks.org/d3-js-selection-exit-function/ used to remove the data not needed when filtering
        dot_update.exit().remove(); 
    }

    // Set up event listener for dropdown change
    const dropdownOption = d3.select("#region-select");

    //referneced for how to change the graph when the dropdown is selected https://d3-graph-gallery.com/graph/line_select.html
    dropdownOption.on("change", function (d) {
        var regionChosen = d3.select(this).property("value");
        updatePlot(regionChosen);
    });

    updatePlot("All");
}
