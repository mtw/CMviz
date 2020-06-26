function makeDoubleSlider(scoreType, textType) {
    // config values
    var totalLength = 135;
    var y = 10;

    // text formatting
    var getText = {
        int: (score) => score.toFixed(0),
        float1: (score) => score.toFixed(1),
        float2: (score) => score.toFixed(2),
        exp: (score) => score.toExponential(1),
        floate: (score) => "^" + score.toFixed(1),
    }[textType];

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
    var Line, leftCircle, rightCircle, valueText, hoverCircle;
    makeObjs();

    /// FUNCTION DEFINITIONS

    // helper functions
    function setScale() {
        scale = d3
            .scaleLinear()
            .domain([0, totalLength])
            .range([minValue, maxValue]);
    }

    function setMinAndMax() {
        minValue = Number.POSITIVE_INFINITY;
        maxValue = Number.NEGATIVE_INFINITY;

        for (obj of CMDATA) {
            let v = obj[scoreType];
            if (v > maxValue) maxValue = v;
            if (v < minValue) minValue = v;
        }

        if (minValue > 0) {
            minValue *= 0.999;
        } else {
            minValue *= 1.001;
        }

        if (maxValue > 0) {
            maxValue *= 1.001;
        } else {
            maxValue *= 0.999;
        }
    }

    function updatePositions() {
        leftCircle.attr("cx", left);
        rightCircle.attr("cx", right);
        Line.attr("x1", left).attr("x2", right);
    }

    // creators
    function makeObjs() {
        // dragging circle
        var dragHandler = d3
            .drag()
            .on("start", dragCircleStart)
            .on("drag", dragCircle)
            .on("end", dragCircleEnd);

        var svg = d3
            .select("#sliders div")
            .append("svg")
            .style("height", y * 2)
            .style("width", totalLength + 65 + 60)
            .classed(scoreType, true);

        var obj = svg.append("g").attr("transform", `translate(65,0)`);

        // background line
        obj.append("line")
            .attr("x1", 0)
            .attr("x2", totalLength)
            .attr("y1", y)
            .attr("y2", y)
            .style("stroke", "#ccc")
            .style("stroke-width", 5)
            .style("stroke-linecap", "round")
            // .on('mouseover', hoverLine)
            .style("cursor", "help")
            .on("mousemove", hoverLine)
            .on("mouseout", unhoverLine);

        Line = obj
            .append("line")
            .attr("y1", y)
            .attr("y2", y)
            .attr("x1", left)
            .attr("x2", right)
            .style("stroke", "dodgerblue")
            .style("stroke-width", 8)
            .style("stroke-linecap", "round")
            // .on('mouseover', hoverLine)
            .style("cursor", "help")
            .on("mousemove", hoverLine)
            .on("mouseout", unhoverLine);

        hoverCircle = obj
            .append("circle")
            .classed("hoverCircle", true)
            .attr("cy", y)
            .attr("r", 6)
            .style("fill", "hsl(209.6,100%,90%)")
            .style("stroke", "#666")
            .style("stroke-width", 0.7)
            .style("display", "none")
            .style("cursor", "help")
            .on("mousemove", hoverLine)
            .on("mouseout", unhoverLine);

        leftCircle = obj
            .append("circle")
            .classed("grabCircle", true)
            .attr("cy", y)
            .attr("r", 7)
            .attr("cx", left)
            .style("fill", "white")
            .style("stroke", "#666")
            .style("stroke-width", 0.7)
            .attr("which", "left")
            .call(dragHandler);

        rightCircle = obj
            .append("circle")
            .classed("grabCircle", true)
            .attr("cy", y)
            .attr("r", 7)
            .attr("cx", right)
            .style("fill", "white")
            .style("stroke", "#666")
            .style("stroke-width", 0.7)
            .attr("which", "right")
            .call(dragHandler);

        cmCircle = obj
            .append("circle")
            .classed("cmCircle", true)
            .attr("cy", y)
            .attr("r", 3)
            // .style('fill', 'rgba(0,0,0,0.1)')
            .style("fill", "white")
            .style("stroke", "red")
            .style("stroke-width", 0.7)
            .style("display", "none");

        valueText = svg
            .append("text")
            .classed("valueText", true)
            .attr("x", totalLength + 78)
            .attr("y", y + 4);

        svg.append("text")
            .attr("x", 54)
            .attr("y", y + 4)
            .attr("text-anchor", "end")
            .text(scoreType);
    }

    // behaviors
    function dragCircle() {
        var x = d3.event.x;
        d3.event.sourceEvent.stopPropagation();

        // impose left and right limits
        if (x < 0) x = 0;
        if (x > totalLength) x = totalLength;

        // add blue shade on collision
        var which = d3.select(this).attr("which");

        if (which == "left") {
            left = x;
            if (left > right) right = left;
        } else if (which == "right") {
            right = x;
            if (right < left) left = right;
        }

        if (right == left) {
            rightCircle.style("fill", "hsl(210, 100%, 80%)");
        } else {
            rightCircle.style("fill", "white");
            d3.select(this).style("fill", "hsl(210, 100%, 90%)");
        }

        valueText.text(getText(scale(x)));
        updatePositions();
        updateInRange();
        updateUtrsOpacity();

        function updateInRange() {
            // update in-range attrs of cm's
            var attrName = `${scoreType}-in-range`;
            var valLeft = scale(left);
            var valRight = scale(right);
            d3.selectAll("rect.cm").attr(
                attrName,
                (d) => valLeft <= d[scoreType] && valRight >= d[scoreType]
            );
        }
    }

    function dragCircleStart() {
        // reformat on drag start
        d3.select(this).style("fill", "hsl(210, 100%, 90%)");
        valueText.text(null);
    }

    function dragCircleEnd() {
        // reformat on drag end
        d3.select(this).style("fill", "white");
        valueText.text(null);
    }

    function hoverLine() {
        // hovering behavior
        var x = d3.event.x - 90;

        if (x < 0) x = 0;
        if (x > totalLength) x = totalLength;

        valueText.text(getText(scale(x))); // display value

        hoverCircle.attr("cx", x).style("display", "inline"); // show hover circle
    }

    function unhoverLine() {
        // unhovering behavior
        valueText.text(null);
        hoverCircle.style("display", "none");
    }

    return scale;
}
