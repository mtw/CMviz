// written by Martin Bagic
// This script creates a hover tooltip that display alignment of cm's.

function makeTooltip() {
    // creates a tooltip
    var tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("text-align", "center")
        .style("visibility", "hidden")
        .attr("id", "tooltip");

    // add text to tooltip
    tooltip
        .append("span")
        .style("white-space", "pre")
        .style("font-family", "Inconsolata")
        .style("font-size", 4);

    // mouseover behavior defined elsewhere
}
