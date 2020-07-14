// written by Martin Bagic
// This script contains functions that create interactive elements in the field view (the right part of the screen),
// and add following behaviors to the elements:
//      - adjusting field width on window resizing
//      - updating sliders when cm rectangles are hovered over
//      - blinking animatimation of cm rectangles when selected


function getData() {
    // get seq -> [cm]
    // create an object with keys being sequence identifiers and values being cm objects that contain information 
    //      from Infernal such as bitscore, alignment, etc.
    var data = {};

    // CMDATA is the object created in main.js by aggregating all cmout files
    for (var cm of CMDATA) {
        var seq = cm.seq;
        if (seq in data) {
            data[seq].push(cm);
        } else {
            data[seq] = [cm];
        }
    }

    return data;
}

function getUniqueCm() {
    // get array of unique cm's so that you can create a unique gradient for each cm
    var uniqueCm = new Set();
    for (var cm of CMDATA) {
        uniqueCm.add(cm["cm"]);
    }
    return Array.from(uniqueCm);
}

function makeCmfield() {
    // main function in the script

    var conf = SETTINGS.cmfield; // shorter variable name

    var data = getData(); // get an object with keys being sequence identifiers and values being cm objects

    var uniqueCm = getUniqueCm(); // get array of unique cm's

    makeNGradients(uniqueCm); // for every cm type, make a color gradient
    makeCmfieldBackground(data); // create gridlines and stripes in the background

    var root = d3.select("svg#cmfield");

    // adjust field size and position
    root.attr("height", (_) => Object.keys(data).length * conf.seqHeight)
        .attr("width", "100%")
        .style("top", conf.seqHeight * 1);

    // make horizontal group ( = identifier text + seq group ); seq group holds the sequence line and cm rectangles
    var seqMegaGroups = root
        .selectAll("seqLines")
        .data(d3.entries(data))
        .enter()
        .append("g")
        .classed("seqIdentifier", true)
        .attr(
            "transform",
            (_, i) => `translate(0,${(i + 0) * conf.seqHeight})`
        );

    // make left sequence identifier text
    var seqText = seqMegaGroups
        .append("text")
        .text((d) => d.key)
        .classed("seqText", true)
        .attr("identifier", (d) => d.key)
        .style("text-anchor", "end")
        .style("font-size", conf.seqTextSize)
        .attr(
            "transform",
            `translate(${conf.textRightBorder},${
            conf.seqHeight - conf.seqTextSize / 2 - 1
            })`
        );

    // add "sequence identifiers" text above
    d3.select("#cmfieldbackground")
        .append("text")
        .text("sequence identifiers")
        .style("text-anchor", "end")
        .style("font-size", conf.seqTextSize)
        .style("font-style", "italic")
        .style("fill", "#555")
        .attr(
            "transform",
            `translate(${conf.textRightBorder},${
            conf.seqHeight - conf.seqTextSize / 2 - 1
            })`
        );

    // make seq group which holds sequence lines and cm rectangles
    var seqMinigroup = seqMegaGroups
        .append("g")
        .attr("transform", `translate(${conf.linesLeftBorder})`);

    // make sequence line on which the cm rectangles will sit
    seqMinigroup
        .append("line")
        .classed("seqLines", true)
        .attr("y1", conf.seqHeight / 2)
        .attr("y2", conf.seqHeight / 2)
        .style("stroke", "#111")
        .style("stroke-width", conf.seqLineWidth);

    // make cm rectangles
    var cms = seqMinigroup
        .selectAll()
        .data((d) => d.value)
        .enter()
        .append("rect")
        .classed("cm", true)
        .attr("width", (d) => d.seq_end - d.seq_start)
        .attr("height", conf.seqHeight / 2 - conf.cmGap)
        .attr("structure_type", (d) => d.cm)
        .attr("x", (d) => d.seq_start)
        .attr("y", (d) =>
            d.strand == "+"
                ? conf.cmGap - conf.seqLineWidth
                : conf.seqHeight / 2 + conf.seqLineWidth
        )
        .attr("fill", (d) => `url(#${d.cm})`)
        .style("cursor", "pointer")
        .on("mouseover", function (d) {
            // show tooltip on mouseover
            d3.select("div#tooltip")
                .style("visibility", "visible")
                .select("span")
                .text(d.alignment);

            // update sliders, show red indicator and values
            updateSliders(d);
        })
        .on("mousemove", function (d) {
            // move tooltip with mouse
            d3.select("div#tooltip")
                .style("top", event.pageY + "px")
                .style("left", event.pageX + 13 + "px");
        })
        .on("mouseout", function (d) {
            // hide tooltip and reset slider indicators
            d3.select("div#tooltip").style("visibility", "hidden");
            d3.selectAll("text.valueText").text(null);
            d3.selectAll("circle.cmCircle").style("display", "none");
        })
        .on("click", function (d) {
            // select or unselect cm's
            if (cmFieldChosen.has(d.ui)) {
                // unselect cm
                cmFieldChosen.delete(d.ui); // delete from selection set
                d3.select(this) // reset formatting
                    .classed("chosen", false)
                    .attr("fill", (d) => `url(#${d.cm})`);

                if (cmFieldChosen.size == 0) {
                    // reformat download button
                    d3.select("#download-button")
                        .classed("downloadable", false)
                        .classed("unclickable", true);

                    d3.select("#clear-selection-button").classed(
                        "clickable",
                        false
                    );
                }
            } else {
                // code for selecting cm
                cmFieldChosen.add(d.ui); // add to selection set
                d3.select(this).classed("chosen", true);

                blinkAnimation(d3.select(this)); // start blink animation

                if (cmFieldChosen.size == 1) {
                    // reformat download button
                    d3.select("#download-button")
                        .classed("downloadable", true)
                        .classed("unclickable", false);

                    d3.select("#clear-selection-button").classed(
                        "clickable",
                        true
                    );
                }
            }

            // add numbering to download button
            d3.select("a#download-button").text(
                `download selection (${cmFieldChosen.size})`
            );
        });

    // initialize all in-range attrs; they are used to apply filtering (dimming) to cm rects
    continuousScores.map(function (score) {
        cms.attr(`${score}-in-range`, true);
    });

    // update horizontal length of sequence lines to fit window upon resizing
    window.addEventListener("resize", updateSeqLength);
    updateSeqLength();
}

function updateSeqLength() {
    // function for updating sequence length on resizing

    // calculate max length of sequences
    let maxLen = 0;
    for (cm of CMDATA) {
        let cmLen = LENDATA[cm.seq];
        if (cmLen && cmLen > maxLen) maxLen = cmLen;
    }

    // calculate max width of window
    let maxWidth = d3.select("#cmfield").node().getBoundingClientRect().width;
    maxWidth -= SETTINGS.cmfield.linesLeftBorder; // account for the right floating text

    // define width normalization function
    let norm = (len) => (len / maxLen) * maxWidth * 0.99 || 0;

    // normalize lines
    d3.selectAll("line.seqLines").attr("x2", (d) => norm(LENDATA[d.key]));

    // normalize position of rects
    d3.selectAll("rect.cm")
        .attr("width", (d) => norm(d.seq_end - d.seq_start))
        .attr("x", (d) => norm(d.seq_start));
}

function updateSliders(d) {
    // function for updating sliders

    // update valueText
    var updateValueText = (scoreType) =>
        d3.select(`svg.${scoreType} .valueText`).text(d[scoreType]);
    continuousScores.map(updateValueText);

    // update cmCircles
    for (var i in continuousScores) {
        var scoreType = continuousScores[i];
        var scale = scales[i];

        var obj = d3.select(`svg.${scoreType} .cmCircle`);
        var value = d[scoreType];
        var x = scale.invert(value); // find x position of cmCircle given the data d from cm

        obj.attr("cx", x).style("display", "inline"); // move cmCircle to position x
    }
}

function blinkAnimation(obj) {
    blink(); // initiate blinking

    function blink() {
        // if cm still chosen, perform animation and call itself, otherwise, break animation
        if (obj.classed("chosen")) {
            obj.style("fill", "gray")
                .transition()
                .duration(200)
                .style("fill", "gray")
                .transition()
                .duration(400)
                .style("fill", (d) => `url(#${d.cm})`)
                .on("end", blink); // call itself
        } else {
            obj.attr("fill", (d) => `url(#${d.cm})`);
        }
    }
}
