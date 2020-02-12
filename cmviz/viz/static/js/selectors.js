
function makeSelectors() {
    var SHOWING = new Map();
    for (var x of CMDATA) if (!SHOWING.has(x.cm)) { SHOWING.set(x.cm, 1) };
    var data = Array(...SHOWING.keys())

    // var specs = {
    //     'h': 30,
    //     'w': 260,
    //     'cactive': 'orange',
    //     'cinactive': 'white',
    // }

    var cmbox = d3.select('#container')
        .selectAll('cmbox')
        .data(data)
        .enter()
        .append('div')
        .attr('class', 'cm-box-rect')
        .text(function (d) { return d })
        .style('color', '#eeeeee')
        // .style('float', 'left')
        .style('display', 'inline-block')
        .style('padding', '2px 4px')
        .style('margin', '3px')
        .style('border-radius', '2px')
        .style('border', '0.5px solid #333333')
        .style('cursor', 'pointer')

    // d3.selectAll('div.cm-box-rect')
    cmbox
        .on('click', function (d) {

            if (SHOWING.get(d) == 1) {
                SHOWING.set(d, 0.1);
                d3.select(this)
                    .style('border-color', d3.select(this).style('background-color'))
                    .style('background-color', 'transparent')
                    .style('color', '#333333')
            } else {
                SHOWING.set(d, 1);
                d3.select(this)
                    .style('background-color', d3.select(this).style('border-color'))
                    .style('border-color', '#333333')
                    .style('color', 'white')
            }

            utrs.select('rect')
                .attr('selector-opacity', function (d) {
                    return SHOWING.get(d.cm)
                });

            updateUtrsOpacity();

        });

}