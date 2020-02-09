
// make UTR groups with: colored rect, text and hover tooltip
function makeUTRs() {

    // create UTR containers for each UTR
    utrs = linegs.selectAll('utrs')
        .data(d => d.value)
        .enter()
        .append('g')
        .attr('class', 'utr')
        .attr('transform', function (d) {
            var ypos = d.strand == '+' ? -SPECS.group_height : 0;
            return `translate(${d.seq_start}, ${ypos})`
        })
        .attr('seq', d => d.seq)

    // create a colored rectangle for each UTR
    var utrRect = utrs.append('rect')
        .attr('width', d => d.seq_end - d.seq_start)
        .attr('height', SPECS.group_height)
        .attr('structure_type', d => d.cm)
        .attr('class', 'cm')
        .attr('rx', 1)
        .attr('ry', 1)

    for (var score of continuousScores) {
        utrRect.attr(`${score}-in-range`, true)
    }


};



function updateUtrsOpacity() {
    utrs.selectAll('rect')
        .attr('fill-opacity', function (d) {
            var I = d3.select(this)
            var ifInRange = score => I.attr(`${score}-in-range`) == "true"
            var inAllRanges = continuousScores.every(ifInRange)

            return inAllRanges ? 1 : 0.1

        })
};


function updateSliders(d) {
    // update valueText
    var updateValueText = scoreType => d3.select(`svg.${scoreType} .valueText`).text(d[scoreType]);
    continuousScores.map(updateValueText);

    // update hoverCircle
    var updateHoverCircle = scoreType => d3.select(`svg.${scoreType} .hoverCircle`).text(d[scoreType]);

}

function defineCMHovering() {

    var fields = [
        'rank', 'inc', 'evalue', 'bitscore', 'bias', 'mdl', 'cm_start', 'cm_end',
        'mdl_alntype', 'seq_start', 'seq_end', 'strand',
        'seq_alntype', 'acc', 'gc', 'trunc', 'seq', 'cm', 'uid',
    ]

    var tooltip = d3.select("div#tooltip")

    function updateFields(d) {
        for (field of fields) {
            d3.select(`div#info span#${field}`).text(d[field])
        }
    };

    function eraseFields() {
        for (field of fields) {
            d3.select(`div#info span#${field}`).text('...')
        }
    }

    function showTooltip(d) {
        tooltip.style('visibility', 'visible')
        tooltip.select("pre").text(d.alignment)
    };


    d3.selectAll('rect.cm')
        .on('mouseover', function (d) {
            updateFields(d);
            showTooltip(d);
            updateSliders(d);

        })
        .on('mousemove', function (d) {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', function (d) {
            tooltip.style('visibility', 'hidden');
            d3.selectAll('text.valueText').text(null)
        })


};

