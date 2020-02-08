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

function makeSelectors() {
    var SHOWING = new Map();
    for (var x of JSONDATA) if (!SHOWING.has(x.cm)) { SHOWING.set(x.cm, 1) };
    var data = Array(...SHOWING.keys())

    var specs = {
        'h': 30,
        'w': 260,
        'cactive': 'orange',
        'cinactive': 'white',
    }

    var cmbox = d3.select('#container')
        .selectAll('cmbox')
        .data(data)
        .enter()
        .append('div')
        .attr('class', 'cm-box-rect')
        .text(function (d) { return d })
        .style('color', '#eeeeee')
        // .style('float', 'left')
        .style('display', 'inline-block')
        .style('padding', '2px 4px')
        .style('margin', '3px')
        .style('border-radius', '2px')
        .style('border', '0.5px solid #333333')
        .style('cursor', 'pointer')

    // d3.selectAll('div.cm-box-rect')
    cmbox
        .on('click', function (d) {

            if (SHOWING.get(d) == 1) {
                SHOWING.set(d, 0.1);
                d3.select(this)
                    .style('border-color', d3.select(this).style('background-color'))
                    .style('background-color', 'transparent')
                    .style('color', '#333333')
            } else {
                SHOWING.set(d, 1);
                d3.select(this)
                    .style('background-color', d3.select(this).style('border-color'))
                    .style('border-color', '#333333')
                    .style('color', 'white')
            }

            utrs.select('rect')
                .attr('selector-opacity', function (d) {
                    return SHOWING.get(d.cm)
                });

            updateUtrsOpacity();

        });

}



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

// fills in the p-tags in the info panel
function makeInfoPanel() {

    var divinfo = d3.select("div#info div")

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
        .text(d => d + ': ')
        .append('span')
        .text('...')
        .style('font-weight', 'normal')
        .attr('id', d => d)

};

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
        .style("margin", 0);

    // mouseover behavior defined elsewhere
};


function makeUploadButton() {
    d3.select("#uploader")
        .append('span')
        .attr('id', 'upload-button')
        .text('upload file!')

    d3.select('#uploader')
        .append('span')
        .text(' (accepted format is .blabla)')
}

function makeDownloadButton() {

    // http://simey.me/saving-loading-files-with-javascript/

    function returnFASTA(me) {

        function extractUTRFasta(rank) {
            var utr = JSONDATA[rank];
            var almnt = utr.alignment.split('\n');
            almnt.pop();
            almnt = almnt.pop();
            almnt = almnt.replace(/-/g, '');
            // console.log(almnt)
            var text = `>${utr.seq}|${utr.seq_start}|${utr.seq_end}|${utr.strand}\n${almnt}\n`
            return text
        }

        if (CHOSEN.size == 0) {
            var href = null
        } else {
            var text = '';
            for (rank of Array.from(CHOSEN)) {
                text += extractUTRFasta(rank);
            }
            var href = 'data:application/octet-stream,' + text;
        }

        d3.select(this).attr('href', href)
    }

    d3.select('#selected')
        .append('a')
        .attr('id', 'download-button')
        .text('download selection!')
        .style('text-decoration', 'none')
        .attr('download', 'CMViz_selection.fasta')
        .on('click', returnFASTA)

}
