function createSoccerViz() {
  d3.csv("worldcup.csv").then((data) => {
    overallTeamViz(data);
  });
}

function overallTeamViz(incomingData) {
  const buttonClick = (datapoint) => {
    const maxValue = d3.max(incomingData, (d) => parseFloat(d[datapoint]));
    const radiusScale = d3.scaleLinear().domain([0, maxValue]).range([2, 20]);
    d3.selectAll("g.overallG")
      .select("circle")
      .attr("r", (d) => radiusScale(d[datapoint]));
  };

  d3.select("svg")
    .append("g")
    .attr("id", "teamsG")
    .attr("transform", "translate(50,300)")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform", (d, i) => `translate(${i * 50}, 0)`);

  const teamG = d3.selectAll("g.overallG");
  teamG.append("circle").attr("r", 20);
  teamG
    .append("text")
    .attr("y", 30)
    .text((d) => d.team);

  const dataKeys = Object.keys(incomingData[0]).filter(
    (d) => d !== "team" && d !== "region"
  );
  d3.select("#controls")
    .selectAll("button.teams")
    .data(dataKeys)
    .enter()
    .append("button")
    .on("click", buttonClick)
    .html((d) => d);
}
