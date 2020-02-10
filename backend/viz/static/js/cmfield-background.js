
function makeCmfieldBackground(data) {

    var conf = SETTINGS.cmfield

    var count = Object.keys(data).length + 1;

    var root = d3.select('svg#cmfieldbackground')
        .attr('height', _ => count * conf.seqHeight)
        .attr('width', '100%')


    var screenWidth = window.screen.width;
    var verticalLinesDistance = 20;
    var verticalLinesCount = Math.ceil(screenWidth / verticalLinesDistance);

    // vertical grid lines
    root
        .append('g')
        .selectAll('verticalLines')
        .data([...Array(verticalLinesCount).keys()])
        .enter()
        .append('line')
        .attr('x1', d => d * verticalLinesDistance + conf.linesLeftBorder)
        .attr('x2', d => d * verticalLinesDistance + conf.linesLeftBorder)
        .attr('y1', 0)
        .attr('y2', count * conf.seqHeight)
        .attr('stroke', '#ddd')
        .attr('stroke-dasharray', '3,3')

    // horizontal stripes
    root
        .append('g')
        .selectAll('horizontalStripes')
        .data([...Array(count).keys()])
        .enter()
        .append('rect')
        .attr('width', '100%')
        .attr('height', conf.seqHeight - conf.cmGap * 2)
        .attr('fill', 'rgba(200,200,230,0.2)')
        .attr('transform', (_, i) => `translate(${conf.linesLeftBorder},${conf.seqHeight * (i * 2 + 1) + conf.cmGap})`)


}