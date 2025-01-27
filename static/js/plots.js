async function plots(sel_bldg){
    let url = `/meter_json/${sel_bldg}`;
    const parseTime = d3.timeParse("%m/%e/%Y");
    let utilityData = await d3.json(url).then(function(data) {
        data.map(d => d.date = parseTime(d.DateTime))
        data.map(d => d.chw = +d.chw)
        data.map(d => d.ele = +d.ele)
        data.map(d => d.stm = +d.stm);
        return data
        });

    const svgWidth = 1000;
    const svgHeight = 500;
    
    const margin = {
    top: 20,
    right: 80,
    bottom: 60,
    left: 80
    };
    
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    
    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    const svg1 = d3
    .select("#scatter_temp")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    const svg2 = d3
    .select("#scatter_time")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    
    // Append an SVG group
    const chartGroup1 = svg1.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const chartGroup2 = svg2.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Initial Params
    let chosenXAxis1 = "temp";
    let chosenXAxis2 = "date";
    let chosenUtility = "chw";
    
    // function used for updating x-scale const upon click on axis label
    const xTempScale = d3.scaleLinear()
        .domain([25, 100])
        .range([0, width]);
    
    function conversion(dateString) {
        return dateString.getUTCFullYear() + "-" +
        ("0" + (dateString.getUTCMonth()+1)).slice(-2) + "-" +
        ("0" + dateString.getUTCDate()).slice(-2);
    }    
    
    let parseDate = d3.timeParse("%m/%d/%Y")
    let startDate = d3.min(utilityData, d => d[chosenXAxis2]);
    console.log(startDate)
    let endDate = d3.max(utilityData, d => d[chosenXAxis2]);
    console.log(endDate)

    function xScale2(utilityData, chosenXAxis2) {
        const xLinearScale2 = d3.scaleTime()
        .domain([startDate*0.999,endDate*1.001])
        .range([0, width]);
        return xLinearScale2;
    }
    function yScale(utilityData, chosenUtility) {
        let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(utilityData, d => d[chosenUtility])*1])
        .range([height, 0]);
        return yLinearScale;
    }
    
    
    // function used for updating xAxis const upon click on axis label
    // function renderXAxes1(newXScale1, xAxis1) {
    //     const bottomAxis1 = d3.axisBottom(newXScale1);
    //     xAxis1.transition()
    //         .duration(1000)
    //         .call(bottomAxis1);
    //     return xAxis1;
    // }
    // function renderXAxes2(newXScale2, xAxis2) {
    //     const bottomAxis2 = d3.axisBottom(newXScale2);
    //     xAxis2.transition()
    //     .duration(1000)
    //     .call(bottomAxis2);
    //     return xAxis2;
    // }
    function renderYAxes(newYScale, yAxis) {
        const leftAxis = d3.axisLeft(newYScale);
        yAxis.transition()
        .duration(1000)
        .call(leftAxis);
        return yAxis;
    }
    
    // function used for updating circles group with a transition to new circles
    function renderCircles1(circlesGroup1, newXScale1, newYScale, chosenXAxis1, chosenUtility) {
    
    circlesGroup1.transition()
        .duration(1000)
        .attr("cx", d => newXScale1(d[chosenXAxis1]))
        .attr("cy", d => newYScale(d[chosenUtility]));
    return circlesGroup1;
    }
    function renderCircles2(circlesGroup2, newXScale2, newYScale, chosenXAxis2, chosenUtility) {
    
        circlesGroup2.transition()
        .duration(1000)
        .attr("cx", d => newXScale2(d[chosenXAxis2]))
        .attr("cy", d => newYScale(d[chosenUtility]));
        return circlesGroup2;
    }
    
    // function used for updating circles group with new tooltip
    function updateToolTip(chosenUtility, circlesGroup) {
        let templabel = "Temp:";
        let ylabel = "";
        if (chosenUtility === "chw") {
            ylabel = "CHW:";
        }
        else if (chosenUtility === "ele") {
            ylabel = "ELE:";
        }
        else {
            ylabel = "STM:";
        }
    
        const toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([0, 0])
            .html(function(d) {
                return (`${conversion(d["date"])}<br>
                        ${templabel} ${d["temp"]}<br>
                        ${ylabel} ${d[chosenUtility].toFixed(0)}`);
            });
    
        circlesGroup.call(toolTip);
    
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data, this);
        });
    
    return circlesGroup;
    }

    let xLinearScale2 = xScale2(utilityData, chosenXAxis2);

    // Create y scale function
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(utilityData, d => d[chosenUtility])])
        .range([height, 0]);

    // Create initial axis functions
    const bottomAxis1 = d3.axisBottom(xTempScale);
    const bottomAxis2 = d3.axisBottom(xLinearScale2);
    const leftAxis1 = d3.axisLeft(yLinearScale);
    const leftAxis2 = d3.axisLeft(yLinearScale);

    // append x axis
    let xAxis1 = chartGroup1.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis1);
    let xAxis2 = chartGroup2.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis2);

    // append y axis
    let yAxis1 = chartGroup1.append("g")
        .call(leftAxis1);
    let yAxis2 = chartGroup2.append("g")
        .call(leftAxis2)

    // append initial circles
    let circlesGroup1 = chartGroup1.selectAll("circle")
        .data(utilityData)
        .enter()
        .append("circle")
        .attr("cx", d => xTempScale(d[chosenXAxis1]))
        .attr("cy", d => yLinearScale(d[chosenUtility]))
        .attr("r", 3)
        .attr("fill", "blue")
        .attr("opacity", ".5");
    let circlesGroup2 = chartGroup2.selectAll("circle")
        .data(utilityData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale2(d[chosenXAxis2]))
        .attr("cy", d => yLinearScale(d[chosenUtility]))
        .attr("r", 3)
        .attr("fill", "blue")
        .attr("opacity", ".5");

    // Create group for 3 x- axis labels
    const xlabelsGroup1 = chartGroup1.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    const xlabelsGroup2 = chartGroup2.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    xlabelsGroup1.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "temp") // value to grab for event listener
        .classed("active", true)
        .text("Average Daily Temperature");
    xlabelsGroup2.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "date") // value to grab for event listener
        .classed("active", true)
        .text("Date");

    // Create group for 3 y- axis labels
    const ylabelsGroup = chartGroup1.append("g")
        .attr("transform", `translate(${width}, ${height / 2})`)
        // .attr("transform", `rotate(-90) translate (${0-height / 2} ${0-margin.left})`)
        // .attr("transform", "rotate(-90)")
        .attr("dy", "1em")
        .classed("axis-text", true);

    const chwLabel = ylabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "chw") // value to grab for event listener
        .classed("active", true)
        .text("CHW");

    const eleLabel = ylabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "ele") // value to grab for event listener
        .classed("inactive", true)
        .text("ELE");

    const stmLabel = ylabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "stm") // value to grab for event listener
        .classed("inactive", true)
        .text("STM");

    // updateToolTip function above csv import
    circlesGroup1 = updateToolTip(chosenUtility, circlesGroup1);
    circlesGroup2 = updateToolTip(chosenUtility, circlesGroup2);

    ylabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenUtility) {

            // replaces chosenXAxis with value
            chosenUtility = value;

            // updates x scale for new data
            yLinearScale = yScale(utilityData, chosenUtility);

            // updates x axis with transition
            yAxis1 = renderYAxes(yLinearScale, yAxis1);
            yAxis2 = renderYAxes(yLinearScale, yAxis2);

            // updates circles with new x values
            circlesGroup1 = renderCircles1(circlesGroup1, xTempScale, yLinearScale, chosenXAxis1, chosenUtility);
            circlesGroup2 = renderCircles2(circlesGroup2, xLinearScale2, yLinearScale, chosenXAxis2, chosenUtility);
            // textGroup = renderText(textGroup, xLinearScale1, yLinearScale, chosenXAxis1, chosenUtility);

            // updates tooltips with new info
            circlesGroup1 = updateToolTip(chosenUtility, circlesGroup1);
            circlesGroup2 = updateToolTip(chosenUtility, circlesGroup2);

            // changes classes to change bold text
            if (chosenUtility === "chw") {
                chwLabel
                    .classed("active", true)
                    .classed("inactive", false);
                eleLabel
                    .classed("active", false)
                    .classed("inactive", true);
                stmLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenUtility === "ele") {
                chwLabel
                    .classed("active", false)
                    .classed("inactive", true);
                eleLabel
                    .classed("active", true)
                    .classed("inactive", false);
                stmLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                chwLabel
                    .classed("active", false)
                    .classed("inactive", true);
                eleLabel
                    .classed("active", false)
                    .classed("inactive", true);
                stmLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });
};
