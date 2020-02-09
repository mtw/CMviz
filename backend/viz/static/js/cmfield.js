// get seq -> [cm]
function getData() {
    var data = {};

    for (var cm of JSONDATA) {
        var seq = cm.seq;
        if (seq in data) {
            data[seq].push(cm)
        } else {
            data[seq] = [cm]
        }
    }

    return data;
}

function makeCmfield() {

    var conf = {
        seqHeight: 23,
        textRightBorder: 150,
        linesLeftBorder: 160,
        seqTextSize: 12,
        cmGap: 2,
    }

    var data = getData();


    var root = d3.select('svg#cmfield')
        .attr('height', _ => Object.keys(data).length * conf.seqHeight)
        .attr('width', 1000)


    // vertical grid lines
    root
        .append('g')
        .selectAll('verticalLines')
        .data([...Array(50).keys()])
        .enter()
        .append('line')
        .attr('x1', d => d * 20 + conf.linesLeftBorder)
        .attr('x2', d => d * 20 + conf.linesLeftBorder)
        .attr('y1', 0)
        .attr('y2', 1000)
        .attr('stroke', '#ddd')
        .attr('stroke-dasharray', '3,3')

    // horizontal stripes
    root
        .append('g')
        .selectAll('horizontalStripes')
        .data([...Array(50).keys()])
        .enter()
        .append('rect')
        .attr('width', 1000)
        .attr('height', conf.seqHeight - conf.cmGap * 2)
        .attr('fill', 'rgba(200,200,230,0.2)')
        .attr('transform', (_, i) => `translate(${conf.linesLeftBorder},${conf.seqHeight * (i * 2 + 1) + conf.cmGap})`)

    // horizontal group: text + seq group
    var seqMegaGroups = root.selectAll('seqLines')
        .data(d3.entries(data))
        .enter()
        .append('g')
        .attr('transform', (_, i) => `translate(0,${(i + 0) * conf.seqHeight})`)

    // left seq id text
    var seqText = seqMegaGroups
        .append('text')
        .classed('seqIdentifier', true)
        .text(d => d.key)
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
        .style('stroke', '#222')
        .style('stroke-width', 0.5)

    // cm's
    var cms = seqMinigroup
        .selectAll('cms')
        .data(d => d.value)
        .enter()
        .append('rect')
        .classed('cm', true)
        .attr('width', d => d.seq_end - d.seq_start)
        .attr('height', conf.seqHeight / 2 - conf.cmGap)
        .attr('structure_type', d => d.cm)
        .attr('x', d => d.seq_start)
        .attr('y', d => d.strand == '+' ? conf.cmGap : conf.seqHeight / 2)
        .attr('fill', 'red')
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


    function getSeqLength() {
        return 700;
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