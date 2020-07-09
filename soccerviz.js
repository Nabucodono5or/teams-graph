import { csv, html } from "d3-fetch";
import { select, selectAll } from "d3-selection";
import { keys, values } from "d3-collection";
import { max } from "d3-array";
import { scaleLinear, scaleOrdinal, scaleQuantize } from "d3";
import { color } from "d3-color";
import images from "./images/*.png"; // cria um objeto onde key é nome da imagem sem sufixo e value seu endereço dentro do dist/
import {
  interpolateHsl,
  interpolateHcl,
  interpolateHue,
  interpolateLab,
} from "d3-interpolate";
import { schemePaired, schemeAccent, schemeOranges } from "d3-scale-chromatic";

/// ----------------funções auxiliares --------------------------------
function inciandoGraficos(teamG, mesuareColor) {
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
    .style("stroke", "black")
    .style()
    .style("stroke-width", "1px");
}

function inserindoBandeiras(teamG) {
  teamG
    .insert("image")
    .attr("xlink:href", (d) => {
      let img = images[d.team];
      return img;
    })
    .attr("width", "45px")
    .attr("height", "20px")
    .attr("x", "-22")
    .attr("y", "-10");
}

function inserindoTabelaModal() {
  let data = require("./resources/modal.html");
  console.log(data);
  select("body").append("div").attr("id", "modal").html(data);
  // o código abaixo não funciona com parcel
  // html(require("./resources/modal.html")).then((data) => {
  //   console.log(data);
  //   select("body").append("div").attr("id", "modal").html(data);
  // });
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

function criandoEventoClickModal(tag, callback) {
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
  inserindoBandeiras(teamG);
  inserindoTabelaModal();

  teamG
    .append("text")
    .attr("y", 30)
    .style("text-anchor", "middle")
    // .style("font-size", "10px") // não use se for usar classes css
    .text((d) => {
      return d.team;
    });

  criandoButtons(dataKeys);
  criandoEventoClick("button.teams", buttonClick);
  criandoEventoMouseOver("g.overallG", highlightRegion2);
  criandoEventoMouseout("g.overallG", unHighLight);
  criandoEventoClickModal("g.overallG", teamClick);

  // funções internas dentro do overallTeamViz
  function teamClick(d) {
    selectAll("td.data")
      .data(values(d))
      .html((p) => {
        console.log(p);
        return p;
      });
  }

  function buttonClick(datapoint) {
    let maxValue = max(incomingData, (el) => {
      return parseFloat(el[datapoint]);
    });

    // let mesuareColor = scaleLinear()
    //   .interpolate(interpolateLab)
    //   .domain([0, maxValue])
    //   .range(["yellow", "blue"]);

    let categorias = ["UEFA", "CONMEBOL", "CAF", "AFC"];
    let radiusScale = scaleLinear().domain([0, maxValue]).range([2, 20]);
    let shemaColors = scaleOrdinal().domain(categorias).range(schemePaired);
    let schemaImpacts = scaleQuantize()
      .domain([0, maxValue])
      .range(schemeOranges[3]);
    console.log(schemePaired);

    teamG
      .select("circle")
      .transition()
      .duration(1000)
      .attr("r", (d) => {
        return radiusScale(d[datapoint]);
      })
      .style("fill", (d) => {
        return schemaImpacts(d[datapoint]);
      });
    // .style("fill", (d, i) => {
    //   return shemaColors(d.region);
    // });
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

  function highlightRegion2(d, i, node) {
    let colorTeam = color("pink");

    select(this).select("text").classed("active", true).attr("y", 10);

    // selectAll("g.overallG")
    //   .select("circle")
    //   .each(function (p, id) {
    //     p.region == d.region
    //       ? select(this).classed("active", true)
    //       : select(this).classed("inactive", true);
    //   });

    selectAll("g.overallG")
      .select("circle")
      .style("fill", function (p, id) {
        return p.region == d.region
          ? colorTeam.darker(0.75)
          : colorTeam.brighter(0.25);
      });
    this.parentElement.appendChild(this);
  }

  function unHighLight() {
    // selectAll("g.overallG").select("circle").attr("class", "");
    selectAll("g.overallG").select("circle").style("fill", "pink");
    selectAll("g.overallG").select("text").attr("class", "");
    selectAll("g.overallG").select("text").attr("y", 30);
  }

  function eventMouseout(datapoint) {
    selectAll("g.overallG").select("circle").style("fill", "pink");
  }

  // select("circle").each(function (d, i) {
  //   console.log(d);
  //   console.log(i);
  //   console.log(this);
  // });
}

//----------------------- loading dos dados -----------------------------
function createSoccerViz() {
  csv(require("./data/worldcup.csv")).then((data) => {
    // console.log(data);
    overallTeamViz(data, "svg");
  });
}

createSoccerViz();
