function makeLinegs() {
    linegs = d3.select('#main')
        .selectAll('linegs')
        .data(d3.entries(UTRDATA))
        .enter()
        .append('g')
        .attr('class', 'seq')

        .attr('transform', function (d, i) {
            return `translate(${SPECS.svg_left_gap}, ${POSLIST[PI[i]]})`
        })
        .style('cursor', 'pointer')
};

// creates the "static" elements: sequence name, tickbox and sequence line
function makeFrame() {

    // sequence name on the left
    linegs.append('text')
        .text(function (d) {
            return d.key
        })
        .attr('x', -SPECS.group_height - 20)
        .attr('y', SPECS.group_height / 8)
        .attr('font-size', SPECS.group_height / 2)
        .style("text-anchor", "end")


    // horizontal sequence line
    linegs.append('line')
        .attr('x1', 0)
        // .attr('y', SPECS.group_height / 2)
        .attr('stroke-width', 0.7)
        .attr('stroke', '#222222')
        .attr('stroke-linecap', 'round')

    linegs.append('text')
        .text('+')
        .attr('x', 0)
        .attr('y', SPECS.group_height / 8 - 4)


    linegs.append('text')
        .text('−')
        .attr('x', 0)
        .attr('y', SPECS.group_height / 8 + 8)
};
