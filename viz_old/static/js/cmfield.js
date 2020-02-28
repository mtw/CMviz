// get seq -> [cm]
function getData() {
    var data = {};

    for (var cm of CMDATA) {
        var seq = cm.seq;
        if (seq in data) {
            data[seq].push(cm)
        } else {
            data[seq] = [cm]
        }
    }

    return data;
}

function getUniqueCm() {
    var uniqueCm = new Set();
    for (var cm of CMDATA) {
        uniqueCm.add(cm['cm'])
    }
    return Array.from(uniqueCm)
}

function makeCmfield() {

    var conf = SETTINGS.cmfield

    var data = getData();

    // console.log(CMDATA)

    var uniqueCm = getUniqueCm();
    // console.log(uniqueCm)
    makeNGradients(uniqueCm);
    makeCmfieldBackground(data);

    var root = d3.select('svg#cmfield')

    root
        .attr('height', _ => Object.keys(data).length * conf.seqHeight)
        .attr('width','100%')
        .style('top', conf.seqHeight*1)


    // horizontal group: text + seq group
    var seqMegaGroups = root.selectAll('seqLines')
        .data(d3.entries(data))
        .enter()
        .append('g')
        .classed('seqIdentifier', true)
        // .attr('identifier', d => d.key)
        .attr('transform', (_, i) => `translate(0,${(i + 0) * conf.seqHeight})`)

    // left seq id text
    var seqText = seqMegaGroups
        .append('text')
        .text(d => d.key)
        // .classed('seqIdentifier', true)
        .classed('seqText', true)
        .attr('identifier', d => d.key)
        .style('text-anchor', 'end')
        .style('font-size', conf.seqTextSize)
        .attr('transform', `translate(${conf.textRightBorder},${conf.seqHeight - conf.seqTextSize / 2 - 1})`)

    // right seq group
    var seqMinigroup = seqMegaGroups
        .append('g')
        .attr('transform', `translate(${conf.linesLeftBorder})`)


    // seq line
    seqMinigroup.append('line')
        .attr('x2', getSeqLength())
        .attr('y1', conf.seqHeight / 2)
        .attr('y2', conf.seqHeight / 2)
        .style('stroke', '#111')
        .style('stroke-width', conf.seqLineWidth)

    // cm's
    var cms = seqMinigroup
        .selectAll()
        .data(d => d.value)
        .enter()
        .append('rect')
        .classed('cm', true)
        .attr('width', d => d.seq_end - d.seq_start)
        .attr('height', conf.seqHeight / 2 - conf.cmGap)
        .attr('structure_type', d => d.cm)
        .attr('x', d => d.seq_start)
        .attr('y', d => d.strand == '+' ? conf.cmGap - conf.seqLineWidth : conf.seqHeight / 2 + conf.seqLineWidth)
        // .attr('fill', 'url(#grad1)')
        .attr('fill', d => `url(#${d.cm})`)
        .on('mouseover', function (d) {

            // show tooltip
            d3.select("div#tooltip")
                .style('visibility', 'visible')
                .select("pre").text(d.alignment)

            // update sliders
            updateSliders(d);
        })
        .on('mousemove', function (d) {
            d3.select("div#tooltip")
                .style("top", (event.pageY) + "px")
                .style("left", (event.pageX + 13) + "px");
        })
        .on('mouseout', function (d) {
            d3.select("div#tooltip").style('visibility', 'hidden');
            d3.selectAll('text.valueText').text(null);
            d3.selectAll('circle.cmCircle').style('display', 'none');
        })
        .on('click', function (d) {


            if (cmFieldChosen.has(d.rank)) {
                cmFieldChosen.delete(d.rank)
                d3.select(this)
                    .classed('chosen', false)
                    .attr('fill', d => `url(#${d.cm})`)
                    .attr('stroke-width', 0)

                if (cmFieldChosen.size == 0) {
                    d3.select('#download-button')
                        .classed('downloadable', false)
                        .classed('unclickable', true)
                }
            }
            else {
                cmFieldChosen.add(d.rank)
                d3.select(this)
                    .attr('fill', '#eee')
                    .attr('stroke', 'gray')
                    .attr('stroke-width', 0.5)
                    .style("stroke-dasharray", ("2,2"))
                    .classed('chosen', true)

                blinkAnimation(d3.select(this))

                if (cmFieldChosen.size == 1) {
                    d3.select('#download-button')
                        .classed('downloadable', true)
                        .classed('unclickable', false)
                }
            }

        });


    function getSeqLength() {
        return 700;
    }

}


function blinkAnimation(obj) {

    blink();

    function blink() {
        if (obj.classed('chosen')) {
            obj.style('fill', 'red').transition().duration(400)
                .style('fill', 'gray').transition().duration(400)
                .style('fill', 'red').on('end', blink)
        } else {
            obj.attr('fill', d => `url(#${d.cm})`)

        }
    }

}



// function updateSliders(d) {
//     // update valueText
//     var updateValueText = scoreType => d3.select(`svg.${scoreType} .valueText`).text(d[scoreType]);
//     continuousScores.map(updateValueText);

//     // update cmCircle

//     for (var i in continuousScores) {
//         var scoreType = continuousScores[i];
//         var scale = scales[i];

//         var obj = d3.select(`svg.${scoreType} .cmCircle`);
//         var value = d[scoreType]
//         var x = scale.invert(value)

//         // console.log(obj);

//         obj.attr('cx', x)
//             .style('display', 'initial')
//     }
// }