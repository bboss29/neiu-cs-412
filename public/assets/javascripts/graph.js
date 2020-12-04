const simulation = d3.forceSimulation(nodes)
simulation.force("link", d3.forceLink(links).id(function(d) { return d.key }))
simulation.force("charge", d3.forceManyBody())
simulation.force("x", d3.forceX(width / 2))
simulation.force("y", d3.forceY(height / 2))

let svg = d3.select('.graph').append('svg')
    .attr("viewBox", [0, 0, width, height])
    .attr("class", "container-fluid")

const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value))

const drag = simulation => {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", d3.color)
    .call(drag(simulation))

node.on("click", clicked)

function clicked(event, d) {
    window.location='/works/view?workKey=' + d.key
}


node
    .attr("data-toggle","tooltip")
    .attr("data-placements", "top")
    .attr("title", d => d.id)

const text = svg.selectAll("text")

const labels = svg.selectAll("text")
    .attr('dy', 24)
    .attr("text-anchor", "middle")
    .text("test");

simulation.on('tick', function () {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
})