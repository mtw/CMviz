function makeGradient(color1, color2, cm) {
    var gradient = d3.select('svg#cmfield defs')
        .append('linearGradient')
        .attr('id', cm)
        .attr('x1', '10%')
        .attr('x2', '90%')
        .attr('y1', '0%')
        .attr('y2', '0%')

    gradient.append('stop')
        .attr('offset', '0%')
        .style('stop-color', color1)
        .style('stop-opacity', 1)

    gradient.append('stop')
        .attr('offset', '100%')
        .style('stop-color', color2)
        .style('stop-opacity', 1)
}

function makeNGradients(uniqueCm) {

    for (var i in uniqueCm) {
        var h1 = i * (1 / uniqueCm.length);
        var h2 = Math.random();
        while (Math.abs(h1 - h2) > 0.2 || Math.abs(h1 - h2) < 0.1) { h2 = Math.random() };

        var color1 = hslToRgb(h1, 0.8, 0.5)
        var color2 = hslToRgb(h2, 0.8, 0.5)

        makeGradient(color1, color2, uniqueCm[i]);
    }
}

function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    // return [r * 255, g * 255, b * 255];
    return `rgb(${r * 255},${g * 255},${b * 255})`
}