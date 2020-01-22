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
        d3.select('#selected span').text(CHOSEN)
    });
}

function defineCMHovering() {

    var fields = [
        'rank', 'inc', 'evalue', 'bitscore', 'bias', 'mdl', 'cm_start', 'cm_end',
        'mdl_alntype', 'seq_start', 'seq_end', 'strand',
        'seq_alntype', 'acc', 'gc', 'trunc', 'seq', 'cm', 'uid',
    ]

    var tooltip = d3.select("div#tooltip")

    function updateFields(d) {
        for (field of fields) {
            d3.select(`div#info span#${field}`).text(d[field])
        }
    };

    function eraseFields() {
        for (field of fields) {
            d3.select(`div#info span#${field}`).text('...')
        }
    }

    function showTooltip(d) {
        tooltip.style('visibility', 'visible')
        tooltip.select("pre").text(d.alignment)
    };


    d3.selectAll('rect.cm')
        .on('mouseover', function (d) {
            updateFields(d);
            showTooltip(d);

        })
        .on('mousemove', function (d) {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', function (d) {
            tooltip.style('visibility', 'hidden')
            // eraseFields()
        })

};


function updateUtrsOpacity() {
    utrs.selectAll('rect')
        .attr('fill-opacity', function (d) {
            var ego = d3.select(this)

            return Math.min(
                ego.attr('evalue-opacity'),
                ego.attr('selector-opacity'),
                ego.attr('bitscore-opacity'),
            )
        })
};

function clickCMBox() {
    // it is in the makeSelectors because of the SHOWING array
}