import { csv } from "d3-fetch";
import { select, selectAll } from "d3-selection";
import { keys } from "d3-collection";
import { max } from "d3-array";

function overallTeamViz(incomingData, tagRaiz) {
  let dataKeys = criandoKeys(incomingData[0]);
  let tag = "button.teams";

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

  function buttonClick(datapoint) {
    console.log("foi cricado");

    //   let maxValue = max(incomingData, (el) => {
    //     return parseFloat(el[datapoint]);
    //   });
  }

  criandoButtons(dataKeys);
  criandoEventoClick(tag, buttonClick);
}

function criandoEventoClick(tag, callback) {
  selectAll(tag).on("click", callback);
}

function criandoButtons(dataKeys) {
  select("#controls")
    .selectAll("button.teams")
    .data(dataKeys)
    .enter()
    .append("button")
    .attr("class", "teams")
    .html((d) => {
      return d;
    });
}

function criandoKeys(objeto) {
  let dataKeys = keys(objeto).filter((propierty) => {
    return propierty != "team" && propierty != "region";
  });

  return dataKeys;
}

function createSoccerViz() {
  csv(require("./data/worldcup.csv")).then((data) => {
    console.log(data);
    overallTeamViz(data, "svg");
  });
}

createSoccerViz();
