// written by Martin Bagic
// This script creates the background grid of the field view and adds window resizing event listener for adjusting window height and scrolling capacity.

function makeCmfieldBackground(data) {
    // make background visuals of the cm field (lines, stripes, grid)
    var conf = SETTINGS.cmfield;

    var count = Object.keys(data).length + 1; // # of minimum rows in the field
    var countHeight = count * conf.seqHeight; // minimum height to display all sequence rows

    function checkOverflow() {
        // if height of field is bigger than height of window, enable scrolling, otherwise disable scrolling
        if (countHeight > window.innerHeight) {
            d3.select("#cmfield-container").style("overflow-y", "scroll");
            d3.select("svg#cmfieldbackground").attr("height", countHeight);
        } else {
            d3.select("#cmfield-container").style("overflow-y", "hidden");
            d3.select("svg#cmfieldbackground").attr(
                "height",
                count * conf.seqHeight
            );
        }
    }

    // adjust scrolling option with window resizing
    window.addEventListener("resize", checkOverflow);

    // if sequence rows do not fill up the screen, increase count of rows to fill up screen
    if (countHeight < window.screen.height)
        count = Math.ceil(window.screen.height / conf.seqHeight);

    // adjust height and width of field
    var root = d3
        .select("svg#cmfieldbackground")
        .attr("height", (_) => count * conf.seqHeight)
        .attr("width", "100%"); // 100% of available container

    // adjust scrolling
    checkOverflow();

    // calculate number of vertical lines needed
    var screenWidth = window.screen.width;
    var verticalLinesDistance = 20;
    var verticalLinesCount = Math.ceil(screenWidth / verticalLinesDistance);

    // vertical grid lines
    root.append("g")
        .selectAll()
        .data([...Array(verticalLinesCount).keys()])
        .enter()
        .append("line")
        .attr("x1", (d) => d * verticalLinesDistance + conf.linesLeftBorder)
        .attr("x2", (d) => d * verticalLinesDistance + conf.linesLeftBorder)
        .attr("y1", 0)
        .attr("y2", count * conf.seqHeight)
        .attr("stroke", "#ddd")
        .attr("stroke-dasharray", "2,2");

    // horizontal stripes
    root.append("g")
        .selectAll()
        .data([...Array(count).keys()])
        .enter()
        .append("rect")
        .attr("width", "100%")
        .attr("height", conf.seqHeight - conf.cmGap * 2)
        .attr("fill", "rgba(200,200,230,0.2)")
        .attr(
            "transform",
            (_, i) =>
                `translate(${conf.linesLeftBorder},${
                    conf.seqHeight * (i * 2 + 1) + conf.cmGap
                })`
        );

    // horizontal grid lines
    root.append("g")
        .selectAll()
        .data([...Array(count).keys()])
        .enter()
        .append("line")
        .attr("x1", conf.linesLeftBorder)
        .attr("x2", conf.linesLeftBorder + window.screen.width)
        .attr("y1", (_, i) => conf.seqHeight * (i + 0.5))
        .attr("y2", (_, i) => conf.seqHeight * (i + 0.5))
        .attr("stroke", "#eee")
        .attr("stroke-dasharray", "3,3");
}
