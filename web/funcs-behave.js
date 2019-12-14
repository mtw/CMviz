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

            // return dragged item to its place
            linegs.transition()
                .attr('transform', function (d, i) {
                    return `translate(${SPECS.svg_left_gap}, ${POSLIST[PI.indexOf(i)]})`
                });
        })
    );
};

function defineTicking() {
    //     tickboxes = d3.selectAll('rect.tickbox');
    //     tickboxes.on('click', function (d, i) {
    //         if (CHOSEN.includes(d.key)) {
    //             CHOSEN.splice(CHOSEN.indexOf(i), 1);
    //             d3.select(this)
    //                 .attr('fill', 'grey')
    //         }
    //         else {
    //             CHOSEN.push(d.key);
    //             d3.select(this)
    //                 .attr('fill', '#1495db')
    //         }
    //         console.log(CHOSEN)
    //     });
    // };

    utrs.on('click', function (d, i) {
        if (CHOSEN.includes(d.rank)) {
            CHOSEN.splice(CHOSEN.indexOf(i), 1);
            d3.select(this)
                .attr('stroke-width', 0);
        }
        else {
            CHOSEN.push(d.rank);
            d3.select(this)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .style("stroke-dasharray", ("2,2"))
        }
        console.log(CHOSEN)
    });
}

// function defineTooltipping() {

//     tooltip = d3.select('body')
//         .append("div")  // declare the tooltip div 
//         .attr("id", "tooltip")              // apply the 'tooltip' class
//         .style("opacity", 0)

//     utrs.on("mouseover", function (d) {
//         tooltip.html(d.alignment)
//             .transition()
//             .duration(5)
//             .style("opacity", .9)
//             .style("left", (d3.event.pageX) + "px")
//             .style("top", (d3.event.pageY - 28) + "px");
//     });

//     utrs.on("mouseout", function (d) {
//         tooltip.transition()
//             .duration(5)
//             .style("opacity", 0);
//     });
// }