function makeBitscoreSlider() {


    var totalLength = 120;
    var y = 10;

    var minValue = Number.POSITIVE_INFINITY;
    var maxValue = Number.NEGATIVE_INFINITY;

    var scoreType = 'bitscore'

    for (obj of JSONDATA) {
        if (obj[scoreType] > maxValue) {
            maxValue = obj[scoreType]
        }
        if (obj[scoreType] < minValue) {
            minValue = obj[scoreType]
        }
    }

    minValue = minValue * 0.999;
    maxValue = maxValue * 1.001;


    var initPos = 0;

    var k = (maxValue - minValue) / totalLength

    function xToValue(x) {
        return minValue + x * k
    }

    function valueToX(value) {
        return (value - minValue) * k
    }

    function getText(score) {
        return score.toFixed(1)
    }

    function dragCircle() {
        var x = d3.event.x;
        d3.event.sourceEvent.stopPropagation()

        if (x < 0) x = 0;
        if (x > totalLength) x = totalLength;

        valueCircle.attr('cx', x);
        rightLine.attr('x1', x);
        leftLine.attr('x2', x);

        var score = xToValue(x)
        var text = getText(score)
        valueText.text(text)

        utrs.selectAll('rect').attr('bitscore-opacity', function (d) {
            return d['bitscore'] > score ? 1 : 0.1;
        });

        updateUtrsOpacity();
    }


    var obj = d3.select('#svg-bitscore')
        .style('height', y * 2)
        .style('height', 20)
        .style('width', totalLength + 50 + 60)
        .append('g')
        .attr('transform', `translate(62,0)`)


    var leftLine = obj.append('line')
        .attr('x1', 0)
        .attr('x2', initPos)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', '#ccc')
        .style('stroke-linecap', 'round')

    var rightLine = obj.append('line')
        .attr('x1', initPos)
        .attr('x2', totalLength)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', '#ccc')
        .style('stroke-width', 6)
        .style('stroke-linecap', 'round')


    var valueCircle = obj.append('circle')
        .attr('cx', initPos)
        .attr('cy', y)
        .attr('r', 7)
        .attr('fill', 'white')
        .attr('stroke', '#666')
        .attr('stroke-width', 0.7)
        .call(d3.drag().on('drag', dragCircle))

    var valueText = d3.select('#svg-bitscore').append('text')
        .attr('x', totalLength + 74)
        .attr('y', y + 4)
        .text(getText(minValue))

    d3.select('#svg-bitscore').append('text')
        .attr('x', 50)
        .attr('y', y + 4)
        .attr('text-anchor', 'end')
        .text('bitscore')

};

function makeEvalueSlider() {

    var minValue = Number.POSITIVE_INFINITY;
    var maxValue = Number.NEGATIVE_INFINITY;

    var scoreType = 'evalue'

    for (obj of JSONDATA) {
        if (obj[scoreType] > maxValue) {
            maxValue = obj[scoreType]
        }
        if (obj[scoreType] < minValue) {
            minValue = obj[scoreType]
        }
    }

    console.log(minValue, maxValue);
    minValue = minValue * 0.999;
    console.log(minValue, maxValue);
    maxValue = maxValue * 1.001;

    var totalLength = 120;

    var initPos = totalLength;

    var deltae = Math.log(maxValue / minValue);
    var minord = Math.log(minValue);
    console.log(deltae, minord)

    function xToValue(x) {
        return Math.exp(1) ** (minord + deltae * (x / totalLength))
    }


    function getText(score) {
        return score.toExponential(1)
    }


    function dragCircle() {
        var x = d3.event.x;
        d3.event.sourceEvent.stopPropagation()

        if (x < 0) x = 0;
        if (x > totalLength) x = totalLength;

        valueCircle.attr('cx', x);
        rightLine.attr('x1', x);
        leftLine.attr('x2', x);


        var score = xToValue(x)
        var text = getText(score)
        valueText.text(text)


        utrs.selectAll('rect').attr('evalue-opacity', function (d) {
            return d['evalue'] > score ? 0.1 : 1;
        });

        updateUtrsOpacity()

    }


    var y = 10;

    var obj = d3.select('#svg-evalue')
        .style('height', y * 2)
        .style('width', totalLength + 50 + 60)
        .append('g')
        .attr('transform', `translate(62,0)`)


    // var leftLine = obj.append('line')
    //     .attr('x1', 0)
    //     .attr('x2', initPos)
    //     .attr('y1', y)
    //     .attr('y2', y)
    //     .style('stroke', 'green')

    // var rightLine = obj.append('line')
    //     .attr('x1', initPos)
    //     .attr('x2', totalLength)
    //     .attr('y1', y)
    //     .attr('y2', y)
    //     .style('stroke', 'red')

    // var valueCircle = obj.append('circle')
    //     .attr('cx', initPos)
    //     .attr('cy', y)
    //     .attr('r', 7)
    //     .attr('fill', 'gray')
    //     .attr('stroke', '#333333')
    //     .attr('stroke-width', 0.7)
    //     .call(d3.drag().on('drag', dragCircle))



    var leftLine = obj.append('line')
        .attr('x1', 0)
        .attr('x2', initPos)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', '#ccc')
        .style('stroke-width', 6)
        .style('stroke-linecap', 'round')

    var rightLine = obj.append('line')
        .attr('x1', initPos)
        .attr('x2', totalLength)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', '#ccc')
        .style('stroke-linecap', 'round')


    var valueCircle = obj.append('circle')
        .attr('cx', initPos)
        .attr('cy', y)
        .attr('r', 7)
        .attr('fill', 'white')
        .attr('stroke', '#666')
        .attr('stroke-width', 0.7)
        .call(d3.drag().on('drag', dragCircle))

    var valueText = d3.select('#svg-evalue').append('text')
        .attr('x', totalLength + 74)
        .attr('y', y + 4)
        .text(getText(maxValue))

    d3.select('#svg-evalue').append('text')
        .attr('x', 50)
        .attr('y', y + 4)
        .attr('text-anchor', 'end')
        .text('evalue')
};


///
//
//
//




// double slider with double text

// function makeDoubleSlider() {

//     var totalLength = 120;
//     var y = 25;



//     var minValue = Number.POSITIVE_INFINITY;
//     var maxValue = Number.NEGATIVE_INFINITY;

//     var scoreType = 'gc'

//     for (obj of JSONDATA) {
//         if (obj[scoreType] > maxValue) {
//             maxValue = obj[scoreType]
//         }
//         if (obj[scoreType] < minValue) {
//             minValue = obj[scoreType]
//         }
//     }

//     minValue = minValue * 0.999;
//     maxValue = maxValue * 1.001;

//     var scale = d3.scaleLinear()
//         .domain([0, totalLength])
//         .range([minValue, maxValue])

//     // var k = (maxValue - minValue) / totalLength

//     // function xToValue(x) {
//     //     return minValue + x * k
//     // }

//     // function valueToX(value) {
//     //     return (value - minValue) * k
//     // }

//     function getText(score) {
//         return score.toFixed(2)
//     }

//     function updatePositions() {
//         leftCircle.attr('cx', left);
//         rightCircle.attr('cx', right);
//         Line.attr('x1', left).attr('x2', right);
//     }

//     function dragCircle() {
//         var x = d3.event.x;
//         d3.event.sourceEvent.stopPropagation()

//         if (x < 0) x = 0;
//         if (x > totalLength) x = totalLength;

//         var which = d3.select(this).attr('which');

//         if (which == 'left') {
//             left = x;
//             if (left > right) right = left;
//         } else if (which == 'right') {
//             right = x;
//             if (right < left) left = right;
//         }

//         updatePositions()

//         text0.text(getText(scale(left)) + ' ' + getText(scale(right)))

//         // var score = xToValue(x)
//         // var text = getText(score)
//         // valueText.text(text)

//         // utrs.selectAll('rect').attr('gc-opacity', function (d) {
//         //     return d['gc'] > score ? 1 : 0.1;
//         // });

//         // updateUtrsOpacity();
//     }

//     var left = minValue * 1.1;
//     var right = maxValue * 0.9;

//     var obj = d3.select('#svg-gc')
//         .style('height', y * 2)
//         // .style('height', y)
//         .style('width', totalLength + 50 + 60)
//         .append('g')
//         .attr('transform', `translate(62,0)`)

//     // background line
//     obj.append('line')
//         .attr('x1', 0)
//         .attr('x2', totalLength)
//         .attr('y1', y)
//         .attr('y2', y)
//         .style('stroke', '#ccc')
//         .style('stroke-width', 6)
//         .style('stroke-linecap', 'round')

//     var Line = obj.append('line')
//         .attr('y1', y)
//         .attr('y2', y)
//         .style('stroke', 'dodgerblue')
//         .style('stroke-width', 6)
//         .style('stroke-linecap', 'round')

//     var leftCircle = obj.append('circle')
//         .attr('cy', y)
//         .attr('r', 7)
//         .attr('fill', 'white')
//         .attr('stroke', '#666')
//         .attr('stroke-width', 0.7)
//         .attr('which', 'left')
//         .call(d3.drag().on('drag', dragCircle))

//     var rightCircle = obj.append('circle')
//         .attr('cy', y)
//         .attr('r', 7)
//         .attr('fill', 'white')
//         .attr('stroke', '#666')
//         .attr('stroke-width', 0.7)
//         .attr('which', 'right')
//         .call(d3.drag().on('drag', dragCircle))

//     var valueText = d3.select('#svg-gc').append('text')
//         .attr('x', totalLength + 74)
//         .attr('y', y + 4)
//         .text(getText(minValue))

//     var text0 = obj.append('text')
//         .attr('x', totalLength / 2)
//         .attr('y', y - 12)
//         .style('text-anchor','middle')

//     d3.select('#svg-gc').append('text')
//         .attr('x', 50)
//         .attr('y', y + 4)
//         .attr('text-anchor', 'end')
//         .text('gc')

//     updatePositions();

// };