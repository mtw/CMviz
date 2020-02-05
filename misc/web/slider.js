//Slider Properties
var width = 320;

var maxValue = 100;
var minValue = 10;
var initialValue = minValue;
var color = "#51CB3F";
var emptyColor = "#ECECEC";
var thumbColor = "white";
var lineWidth = 6;
var thumbSize = 6;
////////////////////////////////////////

var NormValue = (initialValue - minValue) / (maxValue - minValue); // value normalized between 0-1
var selectedValue;
var svg2 = d3.select("#vis").append("svg2").attr('width', width + 30).attr("viewBox", '-15,0,' + (width + 30) + ',40');
// d3.select('#maxValue')
// document.getElementById("maxValue").innerHTML = maxValue;
document.getElementById("value").value = initialValue;

function dragEnded() {
    selectedValue = d3.event.x;

    if (selectedValue < 0)
        selectedValue = 0;
    else if (selectedValue > width)
        selectedValue = width;

    NormValue = selectedValue / width;
    valueCircle.attr("cx", selectedValue);
    valueLine.attr("x2", width * NormValue);
    emptyLine.attr("x1", width * NormValue);

    d3.event.sourceEvent.stopPropagation();
    document.getElementById("value").value = (NormValue * (maxValue - minValue) + minValue).toFixed(2)
}

//Line to represent the current value
var valueLine = svg2.append("line")
    .attr("x1", 0)
    .attr("x2", width * NormValue)
    .attr("y1", 20)
    .attr("y2", 20)
    .style("stroke", color)
    .style("stroke-linecap", "round")
    .style("stroke-width", lineWidth);

//Line to show the remaining value
var emptyLine = svg2.append("line")
    .attr("x1", width * NormValue)
    .attr("x2", width)
    .attr("y1", 20)
    .attr("y2", 20)
    .style("stroke", emptyColor)
    .style("stroke-linecap", "round")
    .style("stroke-width", lineWidth);

//Draggable circle to represent the current value
var valueCircle = svg2.append("circle")
    .attr("cx", width * NormValue)
    .attr("cy", 20)
    .attr("r", thumbSize)
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("fill", thumbColor)
    .call(d3.drag().on("drag", dragEnded));