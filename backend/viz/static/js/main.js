
// http://bl.ocks.org/AlessandraSozzi/9aff786dd04515d6b028'

// define specs
const SPECS = {
    group_height: 10,
    group_gap: 15,
    group_length: 800,
    svg_left_gap: 200,
    // utrjsonFile: 'static/data/test_multi.json',
    genomesFile: 'static/data/genomes.csv',
};


// define globals
var GENOMES = {};
var CHOSEN = new Set();
var POSLIST, PI, UTRDATA, JSONDATA;
const svg = d3.select('svg#main')

var cmFieldChosen = new Set();

// load data
d3.csv(SPECS.genomesFile, function (idata) {
    for (var i in idata) {
        var line = idata[i]
        GENOMES[line[1]] = line
    };
    d3.json(fileToDisplay, function (error, idata) {
        JSONDATA = idata;
        UTRDATA = getUtrData();
        main();
    });
});

function getUtrData() {
    var list = {};
    for (var i = 0; i < JSONDATA.length; i++) {
        var x = JSONDATA[i];
        if (x.seq in list) {
            list[x.seq].push(x)
        }
        else {
            list[x.seq] = [x]
        }
    }
    return list;
};

function main() {

    // dlist of y0 positions of a group
    POSLIST = JSONDATA.map((_, i) => SPECS.group_height * (i + 1) + SPECS.group_gap * i);
    POSLIST.push(POSLIST[-1] + SPECS.group_height);

    // position: line id
    PI = []; var i = 0; for (_ in UTRDATA) { PI.push(i); i++; };

    continuousScores = ['evalue', 'bitscore', 'cm_end', 'seq_start', 'seq_end', 'acc', 'gc'] // 'bias','cm_start'
    continuousScoresText = ['exp', 'float1', 'int', 'int', 'int', 'float2', 'float2']
    scales = [];

    discreteScores = ['inc', 'mdl', 'strand', 'mdl_alntype', 'seq_alntype', 'trunc']

    // make funcs
    makeLinegs();
    makeFrame();
    makeSelectors();
    // makeEvalueSlider();
    // makeBitscoreSlider();
    makeContinuousSlider();
    makeContinuousSlider();
    makeContinuousSlider();
    makeContinuousSlider();

    for (var i in continuousScores) {
        var scoreType = continuousScores[i];
        var textType = continuousScoresText[i];
        var scale = makeDoubleSlider(scoreType, textType);
        scales.push(scale);
    }

    discreteScores.map(scoreType => makeSausage(scoreType))

    makeUTRs();
    // makeDoubleSlider();

    makeInfoPanel();
    makeTooltip();
    // makeUploadButton();
    makeDownloadButton();

    // viz funcs 
    fixWidth();
    fixHeight();
    colorUTRs();
    fixLengths();

    // behave funcs
    defineDragging();
    defineTicking();
    defineCMHovering();

    makeCmfield();

};