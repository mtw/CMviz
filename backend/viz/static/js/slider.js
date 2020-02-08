function makeBitscoreSlider() {

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

    var totalLength = 170;

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
        .append('g')
        .attr('transform', `translate(20,0)`)

    var y = 20;

    var leftLine = obj.append('line')
        .attr('x1', 0)
        .attr('x2', initPos)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', 'red')

    var rightLine = obj.append('line')
        .attr('x1', initPos)
        .attr('x2', totalLength)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', 'green')


    var valueCircle = obj.append('circle')
        .attr('cx', initPos)
        .attr('cy', y)
        .attr('r', 7)
        .attr('fill', 'gray')
        .attr('stroke', '#333333')
        .attr('stroke-width', 0.7)
        .call(d3.drag().on('drag', dragCircle))

    var valueText = obj.append('text')
        .attr('x', totalLength + 10)
        .attr('y', y)
        .text(getText(minValue))
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

    var totalLength = 170;

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


    var obj = d3.select('#svg-evalue')
        .append('g')
        .attr('transform', `translate(20,0)`)

    var y = 20;

    var leftLine = obj.append('line')
        .attr('x1', 0)
        .attr('x2', initPos)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', 'green')

    var rightLine = obj.append('line')
        .attr('x1', initPos)
        .attr('x2', totalLength)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', 'red')

    var valueCircle = obj.append('circle')
        .attr('cx', initPos)
        .attr('cy', y)
        .attr('r', 7)
        .attr('fill', 'gray')
        .attr('stroke', '#333333')
        .attr('stroke-width', 0.7)
        .call(d3.drag().on('drag', dragCircle))

    var valueText = obj.append('text')
        .attr('x', totalLength + 10)
        .attr('y', y)
        .text(getText(maxValue))
};

