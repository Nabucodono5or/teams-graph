import { csv } from "d3-fetch";
import { select, selectAll } from "d3-selection";
import moduleName from 'd3';

function overallTeamViz(incomingData, tagRaiz) {
  select(tagRaiz)
    .append("g")
    .attr("id", "teamsG")
    .attr("transform", "translate(50, 300)")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform", (d, i) => {
      return "translate(" + i * 50 + "," + "0)"; // translate(x, y)
    });

  let teamG = selectAll("g.overallG");

  teamG
    .append("circle")
    .attr("r", 20)
    .style("fill", "pink")
    .style("stroke", "black")
    .style("stroke-width", "1px");

  teamG
    .append("text")
    .attr("y", 30)
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text((d) => {
      return d.team;
    });
}

// function criandoKeys() {
//     let dataKeys = 
// }

function createSoccerViz() {
  csv(require("./data/worldcup.csv")).then((data) => {
    console.log(data);
    overallTeamViz(data, "svg");
  });
}

createSoccerViz();
