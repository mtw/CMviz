
function makeDownloadButton() {

    // http://simey.me/saving-loading-files-with-javascript/

    function returnFASTA() {

        function extractUTRFasta(ui) {
            var utr = CMDATA[ui];
            var almnt = utr.alignment.split('\n');
            almnt.pop();
            almnt = almnt.pop();
            almnt = almnt.replace(/-/g, '');
            almnt = almnt.split('*[');
            almnt = almnt[0];
            // console.log(almnt)
            var text = `>${utr.seq}|${utr.seq_start}|${utr.seq_end}|${utr.strand}\n${almnt}\n`
            return text
        }

        if (cmFieldChosen.size == 0) {
            var href = null
        } else {
            var text = '';
            for (let ui of Array.from(cmFieldChosen)) {
                text += extractUTRFasta(ui);
            }
            var href = 'data:application/octet-stream,' + text;
        }

        d3.select(this).attr('href', href)
    }

    d3.select('a#download-button')
        .style('text-decoration', 'none')
        .attr('download', 'CMViz_selection.fasta')
        .on('click', returnFASTA)

}


function functionalizeClearSelectionButton() {

    d3.select('#clear-selection-button')
        .on('click', function () {

            if (d3.select(this).classed('clickable') == 'false') return;

            console.log('click')
            cmFieldChosen = new Set();


            d3.selectAll('.cm.chosen')
                .classed('chosen', false)
                .attr('fill', d => `url(#${d.cm})`);

            d3.select('#download-button')
                .classed('downloadable', false)
                .classed('unclickable', true)
                .text(`download selection (${cmFieldChosen.size})`);

            d3.select(this)
                .classed('clickable', false);

            console.log(cmFieldChosen)
        })
}