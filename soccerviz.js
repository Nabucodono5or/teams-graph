import { csv } from "d3-fetch";
import { select, selectAll } from "d3-selection";
import { keys } from "d3-collection";
import { max } from "d3-array";
import { scaleLinear } from "d3";

/// ----------------funções auxiliares --------------------------------
function inciandoGraficos(teamG) {
  teamG
    .append("circle")
    .attr("r", 0)
    .transition()
    .delay((d, i) => {
      return i * 100;
    })
    .transition()
    .duration(500)
    .attr("r", 40)
    .transition()
    .duration(500)
    .attr("r", 20)
    .style("fill", "pink")
    .style("stroke", "black")
    .style("stroke-width", "1px");
}

function criandoEventoMouseOver(tag, callback) {
  selectAll(tag).on("mouseover", callback);
}

function criandoEventoClick(tag, callback) {
  selectAll(tag).on("click", callback);
}

function criandoEventoMouseout(tag, callback) {
  selectAll(tag).on("mouseout", callback);
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

//--------------------------- função principal -----------------------
function overallTeamViz(incomingData, tagRaiz) {
  let dataKeys = criandoKeys(incomingData[0]);

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
      return "translate(" + i * 70 + "," + "0)"; // translate(x, y)
    });

  let teamG = selectAll("g.overallG");

  inciandoGraficos(teamG);
  // teamG
  //   .append("circle")
  //   .attr("r", 20)
  //   .style("fill", "pink")
  //   .style("stroke", "black")
  //   .style("stroke-width", "1px");

  teamG
    .append("text")
    .attr("y", 30)
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text((d) => {
      return d.team;
    });

  function buttonClick(datapoint) {
    let maxValue = max(incomingData, (el) => {
      return parseFloat(el[datapoint]);
    });

    let radiusScale = scaleLinear().domain([0, maxValue]).range([2, 20]);

    teamG
      .select("circle")
      .transition()
      .duration(1000)
      .attr("r", (d) => {
        return radiusScale(d[datapoint]);
      });
  }

  function highlightRegion(datapoint) {
    selectAll("g.overallG")
      .select("circle")
      .transition()
      .duration(500)
      .style("fill", (p) => {
        return p.region == datapoint.region ? "red" : "gray";
      });
  }

  function eventMouseout(datapoint) {
    selectAll("g.overallG").select("circle").style("fill", "pink");
  }

  criandoButtons(dataKeys);
  criandoEventoClick("button.teams", buttonClick);
  criandoEventoMouseOver("g.overallG", highlightRegion);
  criandoEventoMouseout("g.overallG", eventMouseout);
}

//----------------------- loading dos dados -----------------------------
function createSoccerViz() {
  csv(require("./data/worldcup.csv")).then((data) => {
    console.log(data);
    overallTeamViz(data, "svg");
  });
}

createSoccerViz();
