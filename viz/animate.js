
// http://bl.ocks.org/AlessandraSozzi/9aff786dd04515d6b028'


const specs = {
    group_height: 20,
    group_gap: 5,
    group_length: 300,
};

var genomes = {};

d3.csv("genomes.csv", function (data) {
    for (var i in data) {
        var line = data[i]
        genomes[line[1]] = line
    }
    console.log(Object.keys(genomes)[1]);
    dof(genomes);
});

function dof(genomes) {

    // console.log(genomes);

    d3.json("test_modified.json", function (error, data) {

        var poslist = data.map((_, i) => specs.group_height * (i + 1) + specs.group_gap * i);

        var objpos = data.map((_, i) => i) // objectid => position

        console.log(poslist);

        const svg = d3.select('svg')
        svg.attr('x', 1000)

        gs = svg.selectAll('gs')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', function (d, i) {
                // console.log(d);
                return `translate(150, ${poslist[objpos[i]]})`
                // return `translate(120, ${poslist[order[i]]- 40})`
            })

        generate_all(gs);

        var colors = get_colors(data);

        gs.selectAll('.cm')
            .attr('fill', function (d) {
                console.log(d);
                return colors[d.cm]
            });

        var lengths = [];

        for (i in data) {
            var d = data[i];
            var iden = d.seq.slice(d.seq.indexOf('_') + 1);
            // console.log(d.seq,iden);
            var leng = +genomes[iden]['utr3'];
            // console.log(iden, leng);
            lengths.push(leng)
        }

        console.log(lengths)

        var maxlength = Math.max(...lengths)
        console.log(maxlength)

        // for (i in lengths){
        //     lengths[i] = lengths[i] / maxlength * specs.group_length;
        // }

        console.log(lengths)

        gs.selectAll('line')
            .attr('x2', function (d, i) {
                var i = d.rank - 1;
                return lengths[i]
            });




        gs.call(d3.drag()
            // .subject(function (d, i) {
            // })
            .on("start", function (d, i) {
            })
            .on("drag", function (d, i) {

                // console.log(d3.event.y);

                var y = d3.event.y + specs.group_height / 2;

                var o = objpos[i]

                // console.log(o, y)

                var onew = Math.round((y - 1) / (specs.group_height + specs.group_gap)) - 1

                if (onew < 0 || onew > objpos.length - 1) {
                    return;
                }

                if (o != onew) {
                    var i_old = objpos.indexOf(onew);
                    objpos[i] = onew;
                    objpos[i_old] = o;

                    gs.attr('transform', function (d, i) {
                        return `translate(150, ${poslist[objpos[i]]})`
                    });
                }


            })
            .on("end", function (d) {

            })
        );




    });
}



function generate_all(gs) {
    gs.append('text')
        .text(function (d) {
            return d.seq
        })
        .attr('x', -120)
        .attr('y', specs.group_height / 8)
        .attr('font-size', specs.group_height / 2)

    gs.append('line')
        .attr('stroke', 'black')
        .attr('x1', function (d) {
            return 0;
        })
        .attr('x2', function (d) {
            return 500;
        })
        .attr('y', specs.group_height / 2)

    gs.append('rect')
        .attr('width', function (d) {
            return d.seq_end - d.seq_start
        })
        .attr('height', specs.group_height)
        .attr('fill', 'grey')
        .attr('x', function (d) {
            return d.seq_start;
        })
        .attr('y', -specs.group_height / 2)
        .attr('structure_type', function (d) {
            return d.cm
        })
        .attr('class', 'cm')
        .attr('opacity',0.8)


    gs.append('text')
        .text(function (d) {
            return d.cm
        })
        .attr('x', function (d) {
            return d.seq_start;
        })
        .attr('fill', 'black')
        .attr('y', 2.5)
        .attr('font-size', 8)

}

function getTranslation(transform) {
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttributeNS(null, "transform", transform);
    var matrix = g.transform.baseVal.consolidate().matrix;
    return [matrix.e, matrix.f];
}



function randomColors(total) {
    var i = 360 / (total - 1); // distribute the colors evenly on the hue range
    var r = []; // hold the generated colors
    for (var x = 0; x < total; x++) {
        r.push(hsvToRgb(i * x, 80, 80)); // you can also alternate the saturation and value for even more contrast between the colors
    };
    return r;
};


function get_colors(data) {
    var cm_types = data.map(record => record.cm);
    cm_types = cm_types.filter((x, i, a) => a.indexOf(x) == i)
    var colors = randomColors(cm_types.length);
    var result = {};
    console.log(colors)
    cm_types.forEach((cm_type, i) => result[cm_type] = get_rgb_line(colors[i]))
    console.log('result', result)
    return result;
};

function get_rgb_line(a) {
    return `rgb(${a[0]},${a[1]},${a[2]})`
}


// var drag = d3.drag()
//     .subject(function () {
//         var t = d3.select(this);
//         var tr = getTranslation(t.attr("transform"));
//         return {
//             x: t.attr("x") + tr[0],
//             y: t.attr("y") + tr[1]
//         };
//     })
//     .on("drag", function (d, i) {
//         d3.select(this).attr("transform", function (d, i) {
//             return "translate(" + [d3.event.x, d3.event.y] + ")"
//         })
//     });

// gs.call(drag)