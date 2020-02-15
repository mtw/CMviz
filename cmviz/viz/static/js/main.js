// define globals
var LENDATA = {};
var CMDATA = [];

var cmFieldChosen = new Set();

var SETTINGS = {
    genomesFile: 'static/data/genomes.csv',
    cmfield: {
        seqHeight: 23,
        textRightBorder: 150,
        linesLeftBorder: 160,
        seqTextSize: 12,
        cmGap: 2,
        seqLineWidth: 0.5,
    },
}


function runMain(){
    let csvPromises = filesDisplay.map(f => d3.csv(f));
    let lengthPromise = d3.csv(SETTINGS.genomesFile)
    let promises = [...csvPromises, lengthPromise]

    Promise.all(promises).then(function (results){
        let lenData = results.pop();
        lenData.map(r => LENDATA[r[0]] = parseInt(r[1]));

        let csvData = results;
        csvData.map(r => CMDATA = CMDATA.concat(r));

        // add unique identifier for download
        CMDATA.map((_,i) => CMDATA[i]['ui'] = i)

        main();
    })
}

function main() {

    continuousScores = ['evalue', 'bitscore', 'cm_end', 'seq_start', 'seq_end', 'acc', 'gc'] // 'bias','cm_start'
    continuousScoresText = ['exp', 'float1', 'int', 'int', 'int', 'float2', 'float2']
    scales = [];

    discreteScores = ['inc', 'mdl', 'strand', 'mdl_alntype', 'seq_alntype', 'trunc']

    makeSelectors();

    for (var i in continuousScores) {
        var scoreType = continuousScores[i];
        var textType = continuousScoresText[i];
        var scale = makeDoubleSlider(scoreType, textType);
        scales.push(scale);
    }

    discreteScores.map(scoreType => makeSausage(scoreType))

    makeInfoPanel();
    makeTooltip();
    makeUploadButton();
    makeDownloadButton();


    makeCmfield();

    // behave funcs
    defineDragging();
    // defineTicking();
    defineCMHovering();


};