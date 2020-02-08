
function makeDownloadButton() {

    // http://simey.me/saving-loading-files-with-javascript/

    function returnFASTA() {

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

    d3.select('a#download-button')
        .style('text-decoration', 'none')
        .attr('download', 'CMViz_selection.fasta')
        .on('click', returnFASTA)

}
