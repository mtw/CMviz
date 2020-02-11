// define globals
var GENOMES = {};
var JSONDATA;

var cmFieldChosen = new Set();

var SETTINGS = {
    genomesFile: 'static/data/genomes.csv',
    cmfield: {
        seqHeight: 23,
        textRightBorder: 150,
        linesLeftBorder: 160,
        seqTextSize: 12,
        cmGap: 2,
    },
}


// load data
d3.csv(SETTINGS.genomesFile, function (idata) {
    for (var i in idata) {
        var line = idata[i]
        GENOMES[line[1]] = line
    };
    d3.csv(fileToDisplay, function (error, idata) {
        JSONDATA = idata;
        main();
    });
});


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
    // makeUploadButton();
    makeDownloadButton();


    makeCmfield();

    // behave funcs
    defineDragging();
    // defineTicking();
    defineCMHovering();


};