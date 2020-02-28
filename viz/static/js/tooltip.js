
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

    tooltip.append('span')
        .style('white-space', 'pre')
        .style('font-family', 'Inconsolata')
        .style('font-size', 4)


    // mouseover behavior defined elsewhere
};