
// fills in the p-tags in the info panel
function makeInfoPanel() {

    var divinfo = d3.select("div#info div#info-container")

    var fields = [
        'rank', 'inc', 'evalue', 'bitscore', 'bias', 'mdl', 'cm_start', 'cm_end',
        'mdl_alntype', 'seq_start', 'seq_end', 'strand',
        'seq_alntype', 'acc', 'gc', 'trunc', 'seq', 'cm', //'uid',
    ]

    var p = divinfo.selectAll('p')
        .data(fields)
        .enter()
        .append('p')
        .attr('class', 'toolbar-information-p')
        .html(d => d + ': ')
        .append('span')
        .text('...')
        .style('font-weight', 'normal')
        .attr('id', d => d)

};