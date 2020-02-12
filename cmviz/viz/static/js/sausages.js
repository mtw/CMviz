function makeSausage(scoreType) {

    var totalLength = 126;
    var y = 20;

    // get possible values
    var allValues = new Set();
    for (var entry of CMDATA) {
        allValues.add(entry[scoreType])
    }

    var linkLength = totalLength / allValues.size;

    // console.log(linkLength)

    var svg = d3.select('#sausages div')
        .append('svg')
        .style('height', y + 1)
        .style('width', totalLength + 60 + 60)
        .classed(scoreType, true)


    svg.append('text')
        .attr('x', 68)
        .attr('y', y / 2 + 5)
        .attr('text-anchor', 'end')
        .text(scoreType)

    var obj = svg
        .append('g')
        .attr('transform', `translate(80,0)`)

    var links = obj
        .selectAll('links')
        .data(Array.from(allValues))
        .enter()
        .append('g')
        .attr('transform', (_, i) => `translate(${i * linkLength + i},0)`)
        .style('cursor', 'pointer')

    var linkRects = links.append('rect')
        // .attr('width', (_, i) => linkLength - i)
        .attr('transform', function () {
            return `translate(${linkLength / 2},0)`
        })
        .attr('height', y)
        .attr('rx', y / 2)
        .attr('fill', 'dodgerblue')


    links.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', (_, i) => `translate(${linkLength / 2},${y / 2 + 4})`)
        .text(d => d)
        .style('font-size', 12)
        .style('fill', 'white')
        .style('font-family', 'Inconsolata, monospace')

    var rectWidth = me => me.parentNode.getBBox().width + 20

    linkRects
        .attr('width', function () {
            return rectWidth(this)
        })
        .attr('transform', function (_, i) {
            var w = rectWidth(this)
            return `translate(${linkLength / 2 - w / 1.5 / 3},0)`
        })


}
