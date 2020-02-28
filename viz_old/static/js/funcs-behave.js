// function defineTicking() {
//     utrs.on('click', function (d, i) {


//         if (CHOSEN.has(d.rank)) {
//             CHOSEN.delete(d.rank)
//             d3.select(this)
//                 .attr('stroke-width', 0);
//             if (CHOSEN.size == 0) {
//                 d3.select('#download-button')
//                     .classed('downloadable', false)
//                     .classed('unclickable', true)
//             }
//         }
//         else {
//             CHOSEN.add(d.rank)
//             d3.select(this)
//                 .attr('stroke', 'black')
//                 .attr('stroke-width', 2)
//                 .style("stroke-dasharray", ("2,2"));

//             if (CHOSEN.size == 1) {
//                 d3.select('#download-button')
//                     .classed('downloadable', true)
//                     .classed('unclickable', false)
//             }
//         }

//         // console.log(CHOSEN, CHOSEN.size)

//         // d3.select('#selected #current').text(Array.from(CHOSEN))
//     });
// }
