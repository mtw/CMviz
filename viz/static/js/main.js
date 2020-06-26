// written by Martin Bagic
// This script performs following functions:
//      - initializes global variables
//      - loads data and preprocesses it
//      - calls all the other functions that create elements and add behavior

// *** GLOBALS ***

var LENDATA = {}; // mapping: identifier -> length
var CMDATA = []; // Infernal data

var cmFieldChosen = new Set(); // global set of chosen cm rects

var SETTINGS = {
    genomesFile: genomesFile,
    cmfield: {
        // specifications of visualization field
        seqHeight: 23,
        textRightBorder: 150,
        linesLeftBorder: 160,
        seqTextSize: 12,
        cmGap: 2,
        seqLineWidth: 0.5,
    },
};

// *** MAIN FUNCTIONS ***

function runMain() {
    // make promises for cmout files and genomes file
    let csvPromises = filesDisplay.map((f) => d3.csv(f));
    let lengthPromise = d3.csv(SETTINGS.genomesFile);
    let promises = [...csvPromises, lengthPromise];

    // fetch data from all promises
    Promise.all(promises).then(function (results) {
        // extract data from genomes file
        let lenData = results.pop(); // fetch last promise
        lenData.map((r) => (LENDATA[r[0]] = parseInt(r[1])), 10); // make a mapping of (element0 -> element1) for each row of genome file

        // extract data from cmout files
        let csvData = results;
        csvData.map((r) => (CMDATA = CMDATA.concat(r))); // concat data from all cmout files

        CMDATA.map((_, i) => (CMDATA[i]["ui"] = i)); // add unique identifier for download reference
        CMDATA.map(
            (_, i) =>
                (CMDATA[i]["evalue"] =
                    Math.round(Math.log10(CMDATA[i]["evalue"]) * 100) / 100)
        ); // log-transform evalue

        // create interface elements
        create_elements();
    });
}

function create_elements() {
    // make filtering sliders; dims cmouts that do not fall in specified range
    continuousScores = [
        "evalue",
        "bitscore",
        "cm_end",
        "seq_start",
        "seq_end",
        "acc",
        "gc",
    ]; // removed 'bias','cm_start'
    continuousScoresText = [
        "floate",
        "float1",
        "int",
        "int",
        "int",
        "float2",
        "float2",
    ];
    scales = [];

    for (var i in continuousScores) {
        var scale = makeDoubleSlider(
            (scoreType = continuousScores[i]),
            (textType = continuousScoresText[i])
        );
        scales.push(scale);
    }

    // make cm field; creates the view grid in the right part of the window
    makeCmfield();

    // make filtering buttons (sausages); dims cmouts that do not fulfill criteria
    discreteScores = [
        "inc",
        "mdl",
        "strand",
        "mdl_alntype",
        "seq_alntype",
        "trunc",
    ];
    discreteScores.map((scoreType) => makeSausage(scoreType));

    // make tooltip; shows alignment on hover
    makeTooltip();

    // make download button; downloads FASTA file of selected cmouts on click
    makeDownloadButton();

    // add dragging behavior; enables swapping of lines
    defineDragging();

    // add clear function to selection button; resets selection of cmouts
    functionalizeClearSelectionButton();
}
