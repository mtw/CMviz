
function makeUploadButton() {

    let submitButton = d3.select('#upload-form input[type=submit]')
        .classed('unclickable', true)
        .property('disabled', true)

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
                submitButton.property('disabled', true)
                    .classed('unclickable', true)
                // disable upload
            } else {
                // enable upload
                submitButton.property('disabled', false)
                    .classed('unclickable', false)

                let fileName = files[0].name;
                fileChooser.text(fileName)
            }
        })


    // let filesExistList = d3.select('#files-exist')
    //     .selectAll()
    //     .data(filesExist)
    //     .enter()
    //     .append('div')
    //     .text(d => d)
    //     .attr('filename', d => d)
    //     .classed('displaying', d => filesDisplay.includes(d) ? true : false)

    let csrfmiddlewaretoken = d3.select('input[name=csrfmiddlewaretoken]').attr('value')

    let filesExistList = d3.select('#files-exist')
        .selectAll()
        .data(filesExist)
        .enter()
        .append('form')
        .attr('filename', d => d)
        .attr('action', '/')
        .attr('method', 'post')

    filesExistList
        .append('input')
        .attr('type', 'submit')
        .classed('button', true)
        .attr('value', d => d)
        .classed('displaying', d => filesDisplay.includes(d) ? true : false)
        .style('width', '100%')

    filesExistList
        .append('input')
        .attr('type', 'hidden')
        .attr('name', 'filename')
        .attr('value', d => d)

    filesExistList
        .append('input')
        .attr('type', 'hidden')
        .attr('name', 'form-type')
        .attr('value', 'selection')

    filesExistList
        .append('input')
        .attr('type', 'hidden')
        .attr('name', 'csrfmiddlewaretoken')
        .attr('value', csrfmiddlewaretoken)



    {/* <input class="button unclickable" style="width:100%;" type="submit" value="upload file" disabled=""> */ }

    d3.selectAll('#files-exist .displaying')
        .style('border', '1px solid red')

}
