function makeSausage(scoreType) {

    var totalLength = 126;
    var y = 20;

    let widthPadding = 5
    let linkGap = 3

    // get possible values
    var allValues = new Set();
    for (var entry of CMDATA) {
        allValues.add(entry[scoreType])
    }

    var linkLength = totalLength / allValues.size;

    var svg = d3.select('#sausages div')
        .append('svg')
        .style('height', y + 1)
        .style('width', totalLength + 60 + 60)
        .classed(scoreType, true)

    // scoreType text
    svg.append('text')
        .attr('x', 68)
        .attr('y', y / 2 + 5)
        .attr('text-anchor', 'end')
        .text(scoreType)

    var obj = svg
        .append('g')
        .attr('transform', `translate(80,0)`)

    var links = obj
        .selectAll()
        .data(Array.from(allValues))
        .enter()
        .append('g')
        // .attr('transform', (_, i) => `translate(${i * linkLength + i},0)`)
        .style('cursor', 'pointer')

    var linkRects = links.append('rect')
        .attr('height', y)
        .attr('rx', 3)
        .attr('fill', 'dodgerblue')

    var linkTexts = links.append('text')
        .attr('text-anchor', 'start')
        .text(d => d)
        .style('font-size', 12)
        .style('fill', 'white')
        .attr('transform', (_, i) => `translate(${widthPadding},${y / 2 + 4})`)
        .style('cursor', 'pointer')
    // .style('font-family', 'Inconsolata, monospace')

    // get widths of linkTexts
    let ws = [];
    linkTexts.each(function () {
        ws.push(this.getBBox().width);
    })

    linkRects.attr('width', (_, i) => ws[i] + widthPadding * 2)

    // get cumulative width
    let wnew = [0];
    for (var i = 1; i < ws.length; i++) {
        wnew[i] = wnew[i - 1] + ws[i - 1];
    }

    links.attr('transform', (_, i) => `translate(${wnew[i] + i * widthPadding * 2 + linkGap * i},0)`)


}
