// define main container width
function fixWidth() {
    var finalw = SPECS.group_length + SPECS.svg_left_gap + 10;
    d3.select('svg#main')
        .attr('width', finalw);

    d3.select('hr')
        .attr('width', finalw);

    d3.select('svg#dash')
        .attr('width', finalw);
};

// stretch svg to fit all sequences
function fixHeight() {
    var height = PI.length * (SPECS.group_height + SPECS.group_gap) + SPECS.group_height;
    svg.attr('height', height);

};

// normalize sequence length
function fixLengths() {
    // get lengths of seqs
    var lengths = [];
    for (i in UTRDATA) {
        var seq = UTRDATA[i][0].seq;
        var iden = seq.slice(seq.indexOf('_') + 1);
        var leng = +GENOMES[iden]['utr3'];
        lengths.push(leng);
    }
    var maxlength = Math.max(...lengths)

    // adjust lengths
    linegs.selectAll('line')
        .attr('x2', function (d, i) {
            var i = d.value[0].rank - 1;
            return lengths[i] / maxlength * SPECS.group_length
        });
};

// color utrs with unique divergent colors
function colorUTRs() {

    // returns colors that distribute evenly across hue range
    function randomColors(total) {
        var i = 360 / (total - 1);
        var r = [];
        for (var x = 0; x < total; x++) {
            r.push(hsvToRgb(i * x, 80, 80));
        };
        return r;
    };

    function getRgbLine(a) {
        return `rgb(${a[0]},${a[1]},${a[2]})`
    }

    // get unique UTRs
    var cmTypes = JSONDATA.map(record => record.cm);
    cmTypes = cmTypes.filter((x, i, a) => a.indexOf(x) == i)

    // get divergent colors
    var palette = randomColors(cmTypes.length);
    var rcolors = {};

    // make cm : color map
    cmTypes.forEach((cmType, i) => rcolors[cmType] = getRgbLine(palette[i]))

    // color UTRs
    linegs.selectAll('.cm')
        .attr('fill', function (d) {
            return rcolors[d.cm]
        });
    d3.selectAll('.cm-box-rect')
        .style('background-color', function (d) {
            return rcolors[d];
        })
        .attr('background-color', d => rcolors[d]);
}
