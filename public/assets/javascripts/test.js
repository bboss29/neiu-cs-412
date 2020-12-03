let width = 640,
    height = 480;

let nodes = []

for (let i = 0; i < 10; i++) {
    nodes.push({ id: "test" + i, x:   i * 10 / width, y: height, })
}


let links = [
    { source: 0, target: 1 },
    { source: 2, target: 4 },
    { source: 2, target: 1 },
]

const simulation = d3.forceSimulation(nodes)
simulation.force("link", d3.forceLink(links))
simulation.force("charge", d3.forceManyBody())
simulation.force("x", d3.forceX(width / 2))
simulation.force("y", d3.forceY(height / 2))

let svg = d3.select('body').append('svg')
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

node.append("title")
    .text(d => d.id);

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