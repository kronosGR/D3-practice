d3.csv("worldcup.csv").then((data) => {
  overallTeamViz(data);
});

function overallTeamViz(incomingData) {
  d3.select("svg")
    .append("g")
    .attr("id", "teamsG")
    .attr("transform", "translate(50,300)")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform", function (d, i) {
      return "translate(" + i * 50 + ", 0)";
    });

  const teamG = d3.selectAll("g.overallG");

  teamG
    .append("circle")
    .attr("r", 0)
    .transition()
    .delay(function (d, i) {
      return i * 100;
    })
    .duration(500)
    .attr("r", 40)
    .transition()
    .duration(500)
    .attr("r", (d) => d.cs);

  teamG
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", 30)
    .style("font-size", "10px")
    .text(function (d) {
      return d.team;
    });

  const dataKeys = Object.keys(incomingData[0]).filter(
    (d) => d !== "team" && d !== "region"
  );

  d3.select("#controls")
    .selectAll("button.teams")
    .data(dataKeys)
    .enter()
    .append("button")
    .on("click", buttonClick)
    .html(function (d) {
      return d;
    });

  function buttonClick(datapoint) {
    const maxValue = d3.max(incomingData, function (d) {
      return parseFloat(d[datapoint.target.innerHTML]);
    });

    const tenColorScale = d3
      .scaleOrdinal()
      .domain(["UEFA", "CONMEBOL", "CAF", "AFC"])
      .range(d3.schemeCategory10)
      .unknown("#c4b9ac");

    const radiusScale = d3.scaleLinear().domain([0, maxValue]).range([2, 20]);
    // d3.selectAll("g.overallG")
    //   .select("circle")
    //   .transition()
    //   .duration(1000)
    //   .attr("r", function (d) {
    //     console.log(radiusScale(d[datapoint.target.innerHTML]));
    //     return radiusScale(d[datapoint.target.innerHTML]);
    //   });
    d3.selectAll("g.overallG")
      .select("circle")
      .transition()
      .duration(1000)
      .style("fill", (p) => tenColorScale(p.region))
      .attr("r", (p) => radiusScale(p[datapoint.target.innerHTML]));

    teamG
      .select("circle")
      .attr("r", 0)
      .transition()
      .delay((d, i) => i * 100)
      .duration(500)
      .attr("r", 40)
      .transition()
      .duration(500)
      .attr("r", function (d) {
        return radiusScale(d[datapoint.target.innerHTML]);
      });

    const ybRamp = d3
      .scaleLinear()
      .interpolate(d3.interpolateHsl)
      .domain([0, maxValue])
      .range(["blue", "yellow"]);

    d3.selectAll("g.overallG")
      .select("circle")
      .attr("r", (d) => radiusScale(d[datapoint]))
      .style("fill", (d) => {
        return ybRamp(d[datapoint.target.innerHTML]);
      });
  }

  teamG.on("mouseover", highlightRegion);
  teamG.on("mouseout", unHighlight);

  function unHighlight() {
    d3.selectAll("g.overallG").select("circle").attr("class", "");
    d3.selectAll("g.overallG")
      .select("text")
      .classed("active", false)
      .attr("y", 30);
  }

  function highlightRegion(d, i) {
    const teamColor = d3.rgb("blue");
    d3.select(this).select("text").classed("highlight", true).attr("y", 10);
    d3.selectAll("g.overallG")
      .select("circle")
      .style("fill", function (p) {
        return p.region == d.region
          ? teamColor.darker(0.75)
          : teamColor.brighter(0.5);
      });
    this.parentElement.appendChild(this);
  }
}
