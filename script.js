
async function firstChart() {
    const data = await d3.csv("https://raw.githubusercontent.com/eakaven123/kaven2.github.io/main/2015.csv");

    const rollup = d3.rollup(
        data,
        v => d3.mean(v, d => +d["Happiness Score"]),
        d => d.Region
    );

    // rollup uses a mapping so each region has the average happiness
    //souce on mapping after grouping https://observablehq.com/@d3/d3-group
    const regionData = Array.from(rollup, ([region, averageHappiness]) => ({ region, averageHappiness }));


    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", 800)
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(50,50)");
        

  
    const x = d3.scaleBand()
        .range([0, 700])
        .domain(regionData.map(d => d.region))
        .padding(0.25);  //spacing between bars

        //source on rotating text https://stackoverflow.com/questions/11252753/rotate-x-axis-text-in-d3
    svg.append("g")
        .attr("transform", "translate(0,200)")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    const y = d3.scaleLinear()
        .domain([0, 8])
        .range([200, 0]);
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

    const maxHappy = d3.max(regionData, function(d){return d.averageHappiness;});

    svg.selectAll(".dot")
    .data(regionData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d.region) + x.bandwidth() / 2)
    .attr("cy", d => y(d.averageHappiness))
    .attr("r", 9)
    .attr("fill", function(d) { 
            if (d.averageHappiness === maxHappy) {
                return "red";
            } else {
                return "steelblue";
            }
        });

        const annotations = [
            {
                note: {
                    label: regionData[2].region + " has the highest average happiness",  
                    align: "middle",              
                    wrap: 500,
                    padding: 5,
                    titleFontSize: 7,
                    fontSize: 5

                },
                x: 180,       
                y: 18,  
                dy: -30,  
                dx: 0                         
            }];
    
        const makeAnnotations = d3.annotation()
            .annotations(annotations);
    
        svg.append("g")
            .call(makeAnnotations);
            

    

}


//this specifies where you want the page to go to when the button is clicked from the first page to firstcharthtml page. page1->page2. this is called in index.html when button is clicked
function secondPage() {
    window.location.href = "firstchart.html";
}

firstChart();
