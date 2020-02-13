
function makeUploadButton() {

    let submitButton = d3.select('#upload-form input[type=submit]')
        .classed('unclickable', true)

    let fileChooser = d3.select('#upload-form label[for=id_docfile]')
        .classed('button', true)
        .attr('width', '100%')
        .style('display', 'block')
        .style('overflow', 'hidden')
        .text('choose file to upload')

    d3.select('#id_docfile')
        .style('display', 'none')
        .style('position', 'absolute')
        .on('change', function () {
            let files = this.files;
            if (files.length == 0) {
                // disable upload
            } else {
                // enable upload
                let fileName = files[0].name;
                fileChooser.text(fileName)
            }
        })

    let ulDocs = d3.select('#uploader ul')
        .style('overflow', 'hidden')

}
