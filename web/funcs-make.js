function makeLinegs() {
    linegs = d3.select('#main')
        .selectAll('linegs')
        .data(d3.entries(UTRDATA))
        .enter()
        .append('g')
        .attr('class', 'seq')

        .attr('transform', function (d, i) {
            return `translate(${SPECS.svg_left_gap}, ${POSLIST[PI[i]]})`
            // return `translate(0, ${POSLIST[PI[i]]})`
        })
        .style('cursor', 'pointer')
};

function makeSelectors2() {
    var SHOWING = new Map();
    for (var x of JSONDATA) if (!SHOWING.has(x.cm)) { SHOWING.set(x.cm, 1) };
    var data = Array(...SHOWING.keys())

    var specs = {
        'h': 30,
        'w': 260,
        'cactive': 'orange',
        'cinactive': 'white',
    }

    var cmbox = d3.select('#cm-box')
        .attr('width', 300)
        // .attr("viewBox", "0,0,300,200")
        .attr('height', data.length * (specs.h + 2) + 10)
        .selectAll('cmbox')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function (d, i) { return `translate(0,${i * (specs.h + 2) + 10})` })
        .style('cursor', 'pointer')

    cmbox.append('rect')
        .attr('class', 'cm-box-rect')
        .attr('fill', specs.cactive)
        .attr('stroke', 'gray')
        .attr('transform', `translate(20,0)`)
        .attr('width', specs.w)
        .attr('height', specs.h)
        .on('click', function (d, i) {
            SHOWING.get(d) == 1 ? SHOWING.set(d, 0.1) : SHOWING.set(d, 1);

            utrs.select('rect').attr('selector-opacity', function (d) {
                return SHOWING.get(d.cm)
            });

            updateUtrsOpacity();

            d3.select(this).style('fill-opacity', function (d) {
                return SHOWING.get(d) + 0.15
            });
        })

    cmbox.append('text')
        .text(d => d)
        .attr('transform', `translate(150,${specs.h / 2 + 5})`)
        .style("text-anchor", "middle")
}

function makeSelectors() {
    var SHOWING = new Map();
    for (var x of JSONDATA) if (!SHOWING.has(x.cm)) { SHOWING.set(x.cm, 1) };
    var data = Array(...SHOWING.keys())

    var specs = {
        'h': 30,
        'w': 260,
        'cactive': 'orange',
        'cinactive': 'white',
    }

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
        .style('cursor', 'pointer')

    cmbox.on('click', function (d, i) {
        SHOWING.get(d) == 1 ? SHOWING.set(d, 0.1) : SHOWING.set(d, 1);

        utrs.select('rect').attr('selector-opacity', function (d) {
            return SHOWING.get(d.cm)
        });

        updateUtrsOpacity();



        d3.select(this)
            // .style('', function (d) {
            //     return SHOWING.get(d)
            // })
            .style('border-color',d3.select(this).style('background-color'))
            .style('background-color','transparent')
            .style('color','#333333')
    })

    // .attr('height')
    // .attr('width', 300)
    // // .attr("viewBox", "0,0,300,200")
    // .attr('height',data.length*(specs.h+2)+10)
    // .selectAll('cmbox')
    // .data(data)
    // .enter()
    // .append('div')
    // .attr('transform', function (d, i) { return `translate(0,${i * (specs.h + 2) + 10})` })
    // .style('cursor', 'pointer')

    // cmbox.append('rect')
    //     .attr('class', 'cm-box-rect')
    //     .attr('fill', specs.cactive)
    //     .attr('stroke', 'gray')
    //     .attr('transform', `translate(20,0)`)
    //     .attr('width', specs.w)
    //     .attr('height', specs.h)
    //     .on('click', function (d, i) {
    //         SHOWING.get(d) == 1 ? SHOWING.set(d, 0.1) : SHOWING.set(d, 1);

    //         utrs.select('rect').attr('selector-opacity', function (d) {
    //             return SHOWING.get(d.cm)
    //         });

    //         updateUtrsOpacity();

    //         d3.select(this).style('fill-opacity', function (d) {
    //             return SHOWING.get(d) + 0.15
    //         });
    //     })

    // cmbox.append('text')
    //     .text(d => d)
    //     .attr('transform', `translate(150,${specs.h / 2 + 5})`)
    //     .style("text-anchor", "middle")
}


function makeEvalueSlider() {

    function dragCircle() {
        var selectedValue = d3.event.x

        if (selectedValue < 0) selectedValue = 0;
        if (selectedValue > maxValue) selectedValue = maxValue;

        valueCircle.attr('cx', selectedValue);
        valueLine.attr('x2', selectedValue);
        emptyLine.attr('x1', selectedValue);

        d3.event.sourceEvent.stopPropagation()

        var normedValue = selectedValue / maxValue;
        var exponent = normedValue * 101 - 100
        var evalue = 10 ** exponent
        valueText.text(evalue.toExponential(1))

        utrs.selectAll('rect').attr('evalue-opacity', function (d) {
            return d.evalue >= evalue ? 0.1 : 1;
        });

        updateUtrsOpacity()

    }

    var obj = d3.select('#svg-evalue')
        .append('g')
        .attr('transform', `translate(20,0)`)

    var maxValue = 200;
    var y = 20;
    var selectedValue = maxValue;

    var emptyLine = obj.append('line')
        .attr('x1', selectedValue)
        .attr('x2', maxValue)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', 'black')

    var valueLine = obj.append('line')
        .attr('x1', 0)
        .attr('x2', selectedValue)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', 'red')

    var valueCircle = obj.append('circle')
        .attr('cx', selectedValue)
        .attr('cy', y)
        .attr('r', 7)
        .attr('fill', 'red')
        .attr('stroke', '#333333')
        .attr('stroke-width', 0.7)
        .call(d3.drag().on('drag', dragCircle))

    var valueText = obj.append('text')
        .attr('x', maxValue + 10)
        .attr('y', y)
        .text('...')
}

function makeBitscoreSlider() {

    function dragCircle() {
        var selectedValue = d3.event.x

        if (selectedValue < 0) selectedValue = 0;
        if (selectedValue > maxValue) selectedValue = maxValue;

        valueCircle.attr('cx', selectedValue);
        valueLine.attr('x1', selectedValue);
        emptyLine.attr('x2', selectedValue);

        d3.event.sourceEvent.stopPropagation()

        var normedValue = selectedValue / maxValue;

        var bitscore = normedValue * 200
        valueText.text(bitscore.toFixed(1))

        utrs.selectAll('rect').attr('bitscore-opacity', function (d) {
            return d.bitscore < bitscore ? 0.1 : 1;
        });

        updateUtrsOpacity()

    }

    var obj = d3.select('#svg-bitscore')
        .append('g')
        .attr('transform', `translate(20,0)`)

    var maxValue = 200.0;
    var y = 20;
    var selectedValue = 0.0;

    var emptyLine = obj.append('line')
        .attr('x1', 0)
        .attr('x2', selectedValue)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', 'black')

    var valueLine = obj.append('line')
        .attr('x1', selectedValue)
        .attr('x2', maxValue)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', 'red')

    var valueCircle = obj.append('circle')
        .attr('cx', selectedValue)
        .attr('cy', y)
        .attr('r', 7)
        .attr('fill', 'red')
        .attr('stroke', '#333333')
        .attr('stroke-width', 0.7)
        .call(d3.drag().on('drag', dragCircle))

    var valueText = obj.append('text')
        .attr('x', maxValue + 10)
        .attr('y', y)
        .text('...')
}

// creates the "static" elements: sequence name, tickbox and sequence line
function makeFrame() {

    // sequence name on the left
    linegs.append('text')
        .text(function (d) {
            return d.key
        })
        .attr('x', -SPECS.group_height - 20)
        .attr('y', SPECS.group_height / 8)
        .attr('font-size', SPECS.group_height / 2)
        .style("text-anchor", "end")


    // horizontal sequence line
    linegs.append('line')
        .attr('x1', 0)
        // .attr('y', SPECS.group_height / 2)
        .attr('stroke-width', 0.7)
        .attr('stroke', '#222222')
        .attr('stroke-linecap', 'round')
};

// make UTR groups with: colored rect, text and hover tooltip
function makeUTRs() {

    // create UTR containers for each UTR
    utrs = linegs.selectAll('utrs')
        .data(function (d) {
            return d.value
        })
        .enter()
        .append('g')
        .attr('class', 'utr')
        .attr('transform', function (d) {
            // return `translate(${d.seq_start}, ${-SPECS.group_height / 2})`
            var ypos = d.strand == '+' ? -SPECS.group_height : 0;
            // console.log(d, ypos, d.seq);
            return `translate(${d.seq_start}, ${ypos})`
        })
        .attr('seq', d => d.seq)

    // create a colored rectangle for each UTR
    utrs.append('rect')
        .attr('width', function (d) {
            return d.seq_end - d.seq_start
        })
        .attr('height', SPECS.group_height)
        .attr('structure_type', function (d) {
            return d.cm
        })
        .attr('class', 'cm')
        // .attr('opacity', 0.95)
        .attr('rx', 1)
        .attr('ry', 1)
        .attr('evalue-opacity', 1)
        .attr('selector-opacity', 1)
        .attr('bitscore-opacity', 1)



};



function updateUtrsOpacity() {
    utrs.selectAll('rect').attr('fill-opacity', function (d) {
        var ego = d3.select(this)

        return Math.min(
            ego.attr('evalue-opacity'),
            ego.attr('selector-opacity'),
            ego.attr('bitscore-opacity'),
        )
    })
};