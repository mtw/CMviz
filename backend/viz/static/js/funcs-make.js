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
            // return `translate(${d.seq_start}, ${-SPECS.group_height / 2})`
            var ypos = d.strand == '+' ? -SPECS.group_height : 0;
            // console.log(d, ypos, d.seq);
            return `translate(${d.seq_start}, ${ypos})`
        })
        .attr('seq', d => d.seq)

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
        .attr('rx', 1)
        .attr('ry', 1)
        .attr('evalue-opacity', 1)
        .attr('selector-opacity', 1)
        .attr('bitscore-opacity', 1)
    // .style('border','0.5px solid #333333')
};



