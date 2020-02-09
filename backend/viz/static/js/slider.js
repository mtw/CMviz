function makeDoubleSlider(scoreType, textType) {

    // config values
    var totalLength = 135;
    var y = 10;

    // text formatting
    var getText = {
        'int': score => score.toFixed(0),
        'float1': score => score.toFixed(1),
        'float2': score => score.toFixed(2),
        'exp': score => score.toExponential(1),
    }[textType]

    // set interval limits
    var minValue, maxValue;
    setMinAndMax(scoreType);

    // set initial x-values
    var left = 0;
    var right = totalLength;

    // create interval scale
    var scale;
    setScale();

    // make objects
    var Line, leftCircle, rightCircle, valueText;
    makeObjs();

    /// FUNCTION DEFINITIONS

    // helper functions
    function setScale() {
        if (textType == 'exp') {
            var deltae = Math.log(maxValue / minValue);
            var minord = Math.log(minValue);
            scale = x => Math.exp(1) ** (minord + deltae * (x / totalLength))
        } else {
            scale = d3.scaleLinear().domain([0, totalLength])
                .range([minValue, maxValue])
        }
    }

    function setMinAndMax() {
        minValue = Number.POSITIVE_INFINITY;
        maxValue = Number.NEGATIVE_INFINITY;


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
    }

    function updatePositions() {
        leftCircle.attr('cx', left);
        rightCircle.attr('cx', right);
        Line.attr('x1', left).attr('x2', right);
    }

    // creators
    function makeObjs() {

        var dragHandler = d3.drag()
            .on('drag', dragCircle)
            .on('end', dragCircleEnd)

        var svg = d3.select('#sliders div')
            .append('svg')
            .style('height', y * 2)
            .style('width', totalLength + 65 + 60)
            .classed(scoreType, true)

        var obj = svg
            .append('g')
            .attr('transform', `translate(65,0)`)

        // background line
        obj.append('line')
            .attr('x1', 0)
            .attr('x2', totalLength)
            .attr('y1', y)
            .attr('y2', y)
            .style('stroke', '#ccc')
            .style('stroke-width', 6)
            .style('stroke-linecap', 'round')

        Line = obj.append('line')
            .attr('y1', y)
            .attr('y2', y)
            .attr('x1', left)
            .attr('x2', right)
            .style('stroke', 'dodgerblue')
            .style('stroke-width', 6)
            .style('stroke-linecap', 'round')

        leftCircle = obj.append('circle')
            .attr('cy', y)
            .attr('r', 7)
            .attr('cx', left)
            .style('fill', 'white')
            .style('stroke', '#666')
            .style('stroke-width', 0.7)
            .attr('which', 'left')
            .call(dragHandler)

        rightCircle = obj.append('circle')
            .attr('cy', y)
            .attr('r', 7)
            .attr('cx', right)
            .style('fill', 'white')
            .style('stroke', '#666')
            .style('stroke-width', 0.7)
            .attr('which', 'right')
            .call(dragHandler)

        valueText = svg
            .append('text')
            .classed('valueText', true)
            .attr('x', totalLength + 78)
            .attr('y', y + 4)

        svg.append('text')
            .attr('x', 54)
            .attr('y', y + 4)
            .attr('text-anchor', 'end')
            .text(scoreType)

        hoverCircle = obj.append('circle')
            .classed('hoverCircle', true)
            .attr('cy', y)
            .attr('r', 2)
            .style('fill', 'rgba(0,0,0,0)')
            .style('stroke', 'red')
            .style('stroke-width', 1.4)
            .style('opacity', 0)

    }

    // behaviors
    function dragCircle() {
        var x = d3.event.x;
        d3.event.sourceEvent.stopPropagation()

        if (x < 0) x = 0;
        if (x > totalLength) x = totalLength;

        var which = d3.select(this).attr('which');

        if (which == 'left') {
            left = x;
            if (left > right) right = left;
        } else if (which == 'right') {
            right = x;
            if (right < left) left = right;
        }



        function updateInRange() {
            var attrName = `${scoreType}-in-range`;
            var valLeft = scale(left);
            var valRight = scale(right);
            utrs.selectAll('rect')
                .attr(attrName, d => valLeft <= d[scoreType] && valRight >= d[scoreType])
        }


        valueText.text(getText(scale(x)))
        updatePositions();

        updateInRange();
        updateUtrsOpacity();
    }

    function dragCircleEnd() {
        // var leftBrace = scale(left) == minValue ? '[ ' : '<';
        // var rightBrace = scale(right) == maxValue ? ' ]' : '>';
        // valueText.text(leftBrace + rightBrace)
        valueText.text(null)
    }
};

