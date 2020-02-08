
function makeUploadButton() {
    d3.select("#uploader")
        .append('span')
        .attr('id', 'upload-button')
        .text('upload file!')

    d3.select('#uploader')
        .append('span')
        .text(' (accepted format is .blabla)')
}
