
// creates the tooltip
function makeTooltip() {

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        // .text("~~~ alignment ~~~")
        // .style("font-style","italic")
        .style("text-align", "center")
        .style("visibility", "hidden")
        .attr("id", "tooltip")
        .append("pre")
        .style("font-style", "normal")
        .style('font-size',6)
        .style("margin", 0);

    // mouseover behavior defined elsewhere
};