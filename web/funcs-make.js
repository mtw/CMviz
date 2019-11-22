
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

    // tickbox on the left
    linegs.append('rect')
        .attr('x', - 35)
        .attr('y', -SPECS.group_height / 2)
        .attr('height', SPECS.group_height)
        .attr('width', SPECS.group_height)
        .attr('fill', 'gray')
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('stroke', '#aaaaaa')
        .attr('stroke-width', 1.5)
        .attr('class', 'tickbox')

    // horizontal sequence line
    linegs.append('line')
        .attr('x1', 0)
        // .attr('y', SPECS.group_height / 2)
        .attr('stroke-width', 7)
        .attr('stroke', '#cccccc')
        .attr('stroke-linecap', 'round')
};

// make UTR groups with: colored rect, text and hover tooltip
function makeUTRs() {

    // create UTR containers for each UTR
    utrs = linegs.selectAll('utrs')
        .data(function (d) {
            return d.value
        })
        .enter()
        .append('g')
        .attr('class', 'utr')
        .attr('transform', function (d) {
            return `translate(${d.seq_start}, ${-SPECS.group_height / 2})`
        })

    // create a colored rectangle for each UTR
    utrs.append('rect')
        .attr('width', function (d) {
            return d.seq_end - d.seq_start
        })
        .attr('height', SPECS.group_height)
        .attr('structure_type', function (d) {
            return d.cm
        })
        .attr('class', 'cm')
        .attr('opacity', 0.95)
        .attr('rx', 3)
        .attr('ry', 3)

    // create alignment tooltip
    utrs.append('svg:title')
        .text(function (d) { return d.alignment; })

    // create UTR name text
    utrs.append('text')
        .text(function (d) {
            return d.cm
        })
        .attr('y', SPECS.group_height / 2 + SPECS.group_gap)
        .attr('x', 3)
        .attr('fill', '#111111')
    // .style("text-anchor", "start")
};


function makeLinegs() {
    linegs = svg.selectAll('linegs')
        .data(d3.entries(UTRDATA))
        .enter()
        .append('g')
        .attr('class', 'seq')

        .attr('transform', function (d, i) {
            return `translate(${SPECS.svg_left_gap}, ${POSLIST[PI[i]]})`
        })
        .style('cursor', 'pointer')
};
