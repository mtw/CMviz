
// http://bl.ocks.org/AlessandraSozzi/9aff786dd04515d6b028'

// define specs
const SPECS = {
    group_height: 15,
    group_gap: 25,
    group_length: 800,
    svg_left_gap: 200,
    utrjsonFile: 'test_multi.json',
    genomesFile: 'genomes.csv',
};


// define globals
var GENOMES = {};
var CHOSEN = [];
var POSLIST, PI, UTRDATA, JSONDATA;
const svg = d3.select('svg#main')


// load data
d3.csv(SPECS.genomesFile, function (idata) {
    for (var i in idata) {
        var line = idata[i]
        GENOMES[line[1]] = line
    };
    d3.json(SPECS.utrjsonFile, function (error, idata) {
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

    
    // make funcs
    makeLinegs();
    makeFrame();
    makeUTRs();
    makeSelectors();
    makeEvalueSlider();
    makeBitscoreSlider();
    makeInfoPanel();
    makeTooltip();
    makeUploadButton();

    // viz funcs 
    fixWidth();
    fixHeight();
    colorUTRs();
    fixLengths();

    // behave funcs
    defineDragging();
    defineTicking();
    defineCMHovering();
    clickCMBox();
};