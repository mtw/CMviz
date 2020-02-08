function makeSlider(scoreType) {

    var minValue = Number.POSITIVE_INFINITY;
    var maxValue = Number.NEGATIVE_INFINITY;


    for (obj of JSONDATA) {
        if (obj[scoreType] > maxValue) {
            maxValue = obj[scoreType]
        }
        if (obj[scoreType] < minValue) {
            minValue = obj[scoreType]
        }
    }

    minValue = minValue - 1e-10;
    maxValue = maxValue + 1e-10;

    var totalLength = 170;

    if (scoreType == 'evalue') {
        var d3SelectPosition = '#svg-evalue'
        var opacityType = 'evalue-opacity'
        var selectedValueProp = 1
        function xToValue(x) {
            return minValue + x / totalLength * (maxValue - minValue)
        }

        function valueToX(value) {
            return (value - minValue) / (maxValue - minValue) * totalLength
        }

        function getText(score) {
            return score.toExponential(1)
        }

    } else if (scoreType == 'bitscore') {
        var d3SelectPosition = '#svg-bitscore'
        var opacityType = 'bitscore-opacity'
        var selectedValueProp = 0

        function xToValue(x) {
            return minValue + x / totalLength * (maxValue - minValue)
        }

        function valueToX(value) {
            return (value - minValue) / (maxValue - minValue) * totalLength
        }

        function getText(score) {
            return score.toFixed(1)
        }

    }


    function dragCircle() {
        var x = d3.event.x;
        d3.event.sourceEvent.stopPropagation()

        if (x < 0) x = 0;
        if (x > totalLength) x = totalLength;

        valueCircle.attr('cx', x);
        valueLine.attr('x1', x);
        emptyLine.attr('x2', x);


        var score = xToValue(x)
        var text = getText(score)
        valueText.text(text)


        utrs.selectAll('rect').attr(opacityType, function (d) {
            return d[scoreType] < score ? 0.1 : 1;
        });

        updateUtrsOpacity()

    }


    var selectedValue = minValue + selectedValueProp * (maxValue - minValue);

    var obj = d3.select(d3SelectPosition)
        .append('g')
        .attr('transform', `translate(20,0)`)

    var y = 20;

    var emptyLine = obj.append('line')
        .attr('x1', 0)
        .attr('x2', valueToX(selectedValue))
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', 'black')

    var valueLine = obj.append('line')
        .attr('x1', valueToX(selectedValue))
        .attr('x2', totalLength)
        .attr('y1', y)
        .attr('y2', y)
        .style('stroke', 'red')

    var valueCircle = obj.append('circle')
        .attr('cx', valueToX(selectedValue))
        .attr('cy', y)
        .attr('r', 7)
        .attr('fill', 'red')
        .attr('stroke', '#333333')
        .attr('stroke-width', 0.7)
        .call(d3.drag().on('drag', dragCircle))

    var valueText = obj.append('text')
        .attr('x', totalLength + 10)
        .attr('y', y)
        .text(getText(selectedValue))
};