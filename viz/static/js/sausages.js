function makeSausage(scoreType) {
    // make the filtering buttons

    var totalLength = 126;
    var y = 20;

    let widthPadding = 5;
    let linkGap = 3;

    // get possible values for a certain criterion
    var allValues = new Set();
    for (var entry of CMDATA) {
        allValues.add(entry[scoreType]);
    }

    // initialize states
    let linkStates = {};
    allValues.forEach((v) => (linkStates[v] = true));

    // create svg to host sausages
    var svg = d3
        .select("#sausages div")
        .append("svg")
        .style("height", y + 1)
        .style("width", totalLength + 60 + 60)
        .classed(scoreType, true);

    // scoreType text
    svg.append("text")
        .attr("x", 68)
        .attr("y", y / 2 + 5)
        .attr("text-anchor", "end")
        .text(scoreType);

    var obj = svg.append("g").attr("transform", `translate(80,0)`);

    // add sausage links/buttons to containers
    var links = obj
        .selectAll()
        .data(Array.from(allValues))
        .enter()
        .append("g")
        .classed("link", true)
        .style("cursor", "pointer");

    // add behavior to links; dim on click
    links.on("click", function (d) {
        let I = d3.select(this);

        let newLinkState = I.classed("falseLink") ? false : true;
        I.classed("falseLink", newLinkState);

        linkStates[d] = !I.classed("falseLink");

        checkCmsLinkCategs();
        updateUtrsOpacity();
    });

    var linkRects = links.append("rect").attr("height", y).attr("rx", 3);

    var linkTexts = links
        .append("text")
        .attr("text-anchor", "start")
        .text((d) => d)
        .style("font-size", 12)
        .attr("transform", (_, i) => `translate(${widthPadding},${y / 2 + 4})`);
    // .style('font-family', 'Inconsolata, monospace')

    // get widths of linkTexts
    let ws = [];
    linkTexts.each(function () {
        ws.push(this.getBBox().width);
    });

    linkRects.attr("width", (_, i) => ws[i] + widthPadding * 2);

    // get cumulative width and fix position of links
    let wnew = [0];
    for (var i = 1; i < ws.length; i++) {
        wnew[i] = wnew[i - 1] + ws[i - 1];
    }
    links.attr(
        "transform",
        (_, i) => `translate(${wnew[i] + i * widthPadding * 2 + linkGap * i},0)`
    );

    function checkCmsLinkCategs() {
        // update cm in-categ filtering attribute
        d3.selectAll("rect.cm").attr(
            `${scoreType}-in-categ`,
            (d) => linkStates[d[scoreType]]
        );
    }

    checkCmsLinkCategs();
}

function updateUtrsOpacity() {
    // check filtering conditions for cm's
    d3.selectAll("rect.cm").attr("fill-opacity", function (d) {
        var I = d3.select(this);
        var ifInRange = (score) => I.attr(`${score}-in-range`) == "true";
        var ifInCateg = (score) => I.attr(`${score}-in-categ`) == "true";
        var inAllRanges = continuousScores.every(ifInRange);
        let inAllCategs = discreteScores.every(ifInCateg);

        return inAllRanges && inAllCategs ? 1 : 0.1;
    });
}
