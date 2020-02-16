// function makeContinuousSlider(minv, maxv) {

//     var conf = {
//         height: 35,
//         width: 250,
//         limitWidth: 5,
//     }

//     var scale = d3.scaleLinear()
//         .domain([0, conf.width])
//         .range([minv, maxv])


//     var left = 10
//     var right = 40

//     function updatePositions() {
//         // leftRect.attr('width', left);
//         midRect.attr('x', left - 1)
//             .attr('width', right - left + 2);
//         // rightRect.attr('x', right)
//         //     .attr('width', conf.width - right);
//     }

//     function dragLimit() {

//         var x = d3.event.x;
//         d3.event.sourceEvent.stopPropagation();

//         // force 0 <= x <= conf.width
//         if (x < 0) x = 0;
//         if (x > conf.width) x = conf.width;

//         // force left <= right
//         var which = d3.event.sourceEvent.buttons // 1 left, 2 right
//         if (which == 1) {
//             left = x;
//             if (left > right) right = left;
//         } else if (which == 2) {
//             right = x;
//             if (right < left) left = right;
//         }

//         updatePositions();

//     }

//     var dragHandler = d3.drag()
//         .filter(_ => true)
//         .on('drag', dragLimit)

//     var div = d3.select('#continuous-sliders')
//         .append('div')
//         .classed('continuous-slider', true)
//         .style('margin', '5px 0')


//     var svg = div.append('svg')
//         .attr('height', conf.height)
//         .attr('width', conf.width)
//         .style('display', 'block')
//         .on('contextmenu', _ => d3.event.preventDefault()) // disable context menu
//         .call(dragHandler)

//     // background rectangle
//     svg.append('rect')
//         .attr('height', conf.height)
//         .attr('width', conf.width)
//         .style('fill', 'rgb(204, 204, 204)')
//         .style('rx', 3)


//     var midRect = svg.append('rect')
//         .attr('height', conf.height)
//         .style('fill', 'hsl(210, 100%, 65%)')
//         .style('rx', 2)

//     // foreground rectangle
//     svg.append('rect')
//         .attr('height', conf.height)
//         .attr('width', conf.width)
//         .style('fill', 'white')
//         .attr('x', 0)
//         .attr('y', 0)
//         .style('opacity', 0)
//         .style('rx', 3)
//         .classed('foreground-rect', true)
//         .on('mouseover', function () {
//             var I = d3.select(this);
//             I.style('opacity', 0.2);
//         })
//         .on('mouseout', function () {
//             var I = d3.select(this);
//             I.style('opacity', 0);
//         })

//     var varNames = svg.append('text')
//         .attr('x', conf.width / 2)
//         .attr('y', conf.height * 0.65)
//         .attr('text-anchor', 'middle')
//         .text('ASFG')

//     updatePositions()

// }