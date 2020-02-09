function defineDragging() {
    // animate dragging
    linegs.call(d3.drag()

        .on("start", function (d, i) {
            d3.select(this).selectAll('.utr')
                .transition(2)
                .style('opacity', 0.5)

            d3.select(this).selectAll('line')
                .transition(2)
                .style('opacity', 0.5)

            d3.select("#tooltip")
                .style('opacity', 0)
        })

        .on("drag", function (d, i) {
            // move with mouse
            d3.select(this).attr("transform", function (d, i) {
                return `translate(${SPECS.svg_left_gap}, ${d3.event.y})`
            })

            // calculate new position in list
            var y = d3.event.y + SPECS.group_height * 1.5 /// 2;
            var pNew = Math.round((y - 1) / (SPECS.group_height + SPECS.group_gap)) - 1
            var pOld = PI.indexOf(i);

            if (pNew == pOld || pNew < 0) {
                // don't allow to slide 
                d3.select(this)
                    .attr("transform", function (d, i) {
                        return `translate(${SPECS.svg_left_gap}, ${POSLIST[pOld]})`
                    });
            }
            else {
                // update list
                PI.splice(pOld, 1)
                PI.splice(pNew, 0, i)

                // refresh position on page
                linegs.attr('transform', function (d, i) {
                    return `translate(${SPECS.svg_left_gap}, ${POSLIST[PI.indexOf(i)]})`
                });
            }
        })

        .on("end", function (d, i) {
            d3.select(this).selectAll('.utr')
                .transition(2)
                .style('opacity', 1);
            d3.select(this).selectAll('line')
                .transition(2)
                .style('opacity', 1);


            d3.select("#tooltip")
                .style('opacity', 1)

            // return dragged item to its place
            linegs.transition()
                .attr('transform', function (d, i) {
                    return `translate(${SPECS.svg_left_gap}, ${POSLIST[PI.indexOf(i)]})`
                });
        })
    );
};

function defineTicking() {
    utrs.on('click', function (d, i) {


        if (CHOSEN.has(d.rank)) {
            CHOSEN.delete(d.rank)
            d3.select(this)
                .attr('stroke-width', 0);
            if (CHOSEN.size == 0) {
                d3.select('#download-button')
                    .classed('downloadable', false)
                    .classed('unclickable', true)
            }
        }
        else {
            CHOSEN.add(d.rank)
            d3.select(this)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .style("stroke-dasharray", ("2,2"));

            if (CHOSEN.size == 1) {
                d3.select('#download-button')
                    .classed('downloadable', true)
                    .classed('unclickable', false)
            }
        }

        // console.log(CHOSEN, CHOSEN.size)

        // d3.select('#selected #current').text(Array.from(CHOSEN))
    });
}
