
make()

function make() {
    var svg = d3
        .select('body')
        .append('svg')
        .attr('height', '400')
        .attr('width', '200')

    var ip = {};
    var pi = {};

    for (var i = 0; i < 11; i++) {
        ip['ID_' + i] = i;
        pi[i] = 'ID_' + i;
    };

    var lineHeight = 20;
    var fontSize = 12;


    var getPos = y => Math.floor(y / lineHeight);

    function swapPos(oldPos, newPos) {

        // console.log(oldPos, newPos)

        // console.log('ip',ip)
        // console.log('pi',pi)

        var oriI = pi[oldPos];
        var shift = oldPos < newPos ? -1 : 1;

        var i = pi[newPos];
        var p = newPos;
        // console.log('i',i)
        // console.log('p',p)

        pi[newPos] = oriI;
        ip[oriI] = newPos;

        // console.log(shift)

        while (p != oldPos) {
            // console.log('while')
            // console.log('ip',ip)
            // console.log('pi',pi)

            p += shift;

            nextI = pi[p];


            // console.log('p',p)
            // console.log('pi[p]',pi[p])
            pi[p] = i;
            // console.log('pi',pi)
            ip[i] = p;
            // console.log('ip',ip)


            i = nextI;
        }

        d3.selectAll('text')
            .attr('transform', function (d) {
                var x = `translate(0, ${ip[d[0]] * lineHeight + fontSize})`;
                // console.log(x);
                return x
            })


    }


    var limitBottom = 0;
    var limitTop = Object.keys(ip).length - 1;

    var dragHandler = d3.drag()
        .on('drag', function () {

            var identifier = d3.select(this).attr('identifier');
            var p1 = ip[identifier];
            var p2 = getPos(d3.event.y);


            if (p2 < limitBottom) p2 = limitBottom;
            if (p2 > limitTop) p2 = limitTop;

            if (p1 != p2) swapPos(p1, p2);

        })

    var rects = svg
        .selectAll('rects')
        .data(Object.entries(ip))
        .enter()
        .append('text')
        .attr('width', 20)
        .attr('height', 20)
        .style('font-size', fontSize)
        .classed('y', true)
        .text(d => d[0])
        .style('cursor','pointer')
        .attr('identifier', d => d[0])
        .attr('transform', d => `translate(0, ${ip[d[0]] * lineHeight + fontSize})`)
        .on('mouseover', function () {
            d3.select(this).classed('g', true)
        })
        .on('mouseout', function () {
            d3.select(this).classed('g', false)
        })
        .call(dragHandler)
}