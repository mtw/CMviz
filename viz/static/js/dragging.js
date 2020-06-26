function defineDragging() {
    // enable dragging behavior of sequence lines

    var lineHeight = SETTINGS.cmfield.seqHeight;

    var seqText = d3.selectAll("g.seqIdentifier > text");

    // create double-way map
    var ip = {};
    var pi = {};
    seqText.each(function (obj, i) {
        ip[obj.key] = i;
        pi[i] = obj.key;
    });

    var getPos = (y) => Math.floor(y / lineHeight); // floor y-position

    function swapPos(oldPos, newPos) {
        // when a sequence is dragged from an old position to a new position,
        // slide all intermediate sequences to fill the gap in the old position
        //      e.g. when oldPos is 2 and newPos is 5, do these transitions:
        //      2->5  5->4  4->3  3->2

        var oriI = pi[oldPos];
        var shift = oldPos < newPos ? -1 : 1;

        var i = pi[newPos];
        var p = newPos;

        pi[newPos] = oriI;
        ip[oriI] = newPos;

        while (p != oldPos) {
            p += shift;

            nextI = pi[p];

            pi[p] = i;
            ip[i] = p;

            i = nextI;
        }

        // move sequences to new positions
        d3.selectAll("g.seqIdentifier").attr(
            "transform",
            (d) => `translate(0,${(ip[d.key] + 0) * lineHeight})`
        );
    }

    // handle dragging above top or below bottom of view field
    var limitBottom = 0;
    var limitTop = Object.keys(ip).length - 1;

    // create handler for dragging event
    var dragHandler = d3.drag().on("drag", function () {
        var identifier = d3.select(this).attr("identifier");

        var p1 = ip[identifier];

        var y = d3.mouse(d3.select("svg#cmfield").node())[1];
        var p2 = getPos(y);

        if (p2 < limitBottom) p2 = limitBottom;
        if (p2 > limitTop) p2 = limitTop;

        if (p1 != p2) swapPos(p1, p2);
    });

    // give seqtext the drag handler
    seqText.call(dragHandler);
}
