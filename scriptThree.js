scatterplot();


async function scatterplot() {
    const data = await d3.csv("https://raw.githubusercontent.com/eakaven123/kaven2.github.io/main/2015.csv");

    //I had issues with floating point and string incompatibility so https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat is used to parse string to float
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
    //the annotation is from week 8 lecture videos
    //https://stackoverflow.com/questions/13049050/can-you-insert-a-line-break-in-text-when-using-d3-js how to break
    const dots = svg.selectAll(".dot")
        .data(formattedData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d,i) {return x(d.family);})
        .attr("cy", function(d,i) {return y(d.happiness);})
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
           
            svg.append("line")
                .attr("x1", 0)
                .attr("y1", 350)
                .attr("x2", 550)
                .attr("y2", 5)
                .attr("stroke", "red")
                .attr("stroke-width", 2);

                const annotations = [
                    {note: {
                            label: "Linearly increasing trend",
                            align: "middle",
                            wrap: 200,
                            padding: 5
                        },
                        x: 275,
                        y: 175,
                        dy: -100,
                        dx: 0,
                        subject: { radius: 3 }
                    }];
        
                const makeAnnotations = d3.annotation()
                    .annotations(annotations);
            
                svg.append("g")
                    .call(makeAnnotations);
        } else {
            filteredData = formattedData.filter(d => d.Region === region); 
            svg.selectAll(".annotation").remove()
            svg.selectAll("line").remove();
        }

        
        const dot_update = svg.selectAll(".dot")
            .data(filteredData, function(d,i) {return d.Country;});

        dot_update.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d,i) {return x(d.family)})
        .attr("cy", function(d,i){return y(d.happiness)})
        .attr("r", 5)
        .style("fill", "steelblue")
        .merge(dot_update)
        .attr("cx", function(d){return x(d.family);})
        .attr("cy", function(d) {return y(d.happiness);});

        //https://www.geeksforgeeks.org/d3-js-selection-exit-function/ used to remove the data not needed when filtering
        dot_update.exit().remove(); 
    }

    // Set up event listener for dropdown change referneced for how to change the graph when the dropdown is selected https://d3-graph-gallery.com/graph/line_select.html

    d3.select("#region-select").on("change", function (d) {
        var regionChosen = d3.select(this).property("value");
        updatePlot(regionChosen);
    });

    updatePlot("All");
}
