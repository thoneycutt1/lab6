var csv = undefined;
d3.csv("http://localhost:8080/data.csv", function (csv) {
  for (var i = 0; i < csv.length; ++i) {
    csv[i].Year = Number(csv[i].Year);
    csv[i].Population = Number(csv[i].Population);
    csv[i].Car_Occupant = Number(csv[i].Car_Occupant);
    csv[i].Pedestrian = Number(csv[i].Pedestrian);
    csv[i].Motorcycle = Number(csv[i].Motorcycle);
    csv[i].Bicycle = Number(csv[i].Bicycle);
    csv[i].Trucks = Number(csv[i].Trucks);
    csv[i].Total = Number(csv[i].Total);
    csv[i].Car_Per_100K = parseFloat(csv[i].Car_Per_100K);
    csv[i].Ped_Per_100K = parseFloat(csv[i].Ped_Per_100K);
    csv[i].Motorcycle_Per_100K = parseFloat(csv[i].Motorcycle_Per_100K);
    csv[i].Bicycle_Per_100K = parseFloat(csv[i].Bicycle_Per_100K);
    csv[i].Trucks_Per_100K = parseFloat(csv[i].Trucks_Per_100K);
    csv[i].Total_Per_100K = parseFloat(csv[i].Total_Per_100K);
    csv[i].registered_auto = parseFloat(csv[i].registered_auto);
    csv[i].registered_motorcycle = parseFloat(csv[i].registered_motorcycle);
    csv[i].registered_truck = parseFloat(csv[i].registered_truck);
    csv[i].Car_Accidents_Per_Registration = parseFloat(
      csv[i].Car_Accidents_Per_Registration
    );
    csv[i].Motorcycle_Accident_Per_Registration = parseFloat(csv[i].Motorcycle_Accident_Per_Registration);
    csv[i].Truck_Accidents_Per_Registration = parseFloat(csv[i].Truck_Accidents_Per_Registration);
    csv[i].Registered_Cars_Per_Capita = parseFloat(csv[i].Registered_Cars_Per_Capita);
  }
  var colors = [
    "#3d6acb",
    "#d23e13",
    "#f6990f",
    "#36931f",
    "#911b98",
    "#369ac5",
    "#d34977",
  ];
  var colorIndex = 0;
  var pickColor = () => {
    if (colorIndex == 6) colorIndex = 0;
    return colors[++colorIndex];
  };
  var currentScale = undefined;
  var currentScale2 = undefined;
  var opt = {
    Population: {
      name: "Population",
      attribute: "Population",
      secondScale: true,
    },
    Car_Occupant: {
      name: "Car_Occupant",
      attribute: "Car_Occupant",
      secondScale: false,
    },
    Pedestrian: {
      name: "Pedestrian",
      attribute: "Pedestrian",
      secondScale: false,
    },
    Motorcycle: {
      name: "Motorcycle",
      attribute: "Motorcycle",
      secondScale: false,
    },
    Bicycle: {
      name: "Bicycle",
      attribute: "Bicycle",
      secondScale: false,
    },
    Trucks: {
      name: "Trucks",
      attribute: "Trucks",
      secondScale: false,
    },
    Total: {
      name: "Total",
      attribute: "Total",
      secondScale: false,
    },
    Car_Per_100K: {
      name: "Car_Per_100K",
      attribute: "Car_Per_100K",
      secondScale: false,
    },
    Ped_Per_100K: {
      name: "Ped_Per_100K",
      attribute: "Ped_Per_100K",
      secondScale: false,
    },
    Motorcycle_Per_100K: {
      name: "Motorcycle_Per_100K",
      attribute: "Motorcycle_Per_100K",
      secondScale: false,
    },
    Bicycle_Per_100K: {
      name: "Bicycle_Per_100K",
      attribute: "Bicycle_Per_100K",
      secondScale: false,
    },
    Trucks_Per_100K: {
      name: "Trucks_Per_100K",
      attribute: "Trucks_Per_100K",
      secondScale: false,
    },
    Total_Per_100K: {
      name: "Total_Per_100K",
      attribute: "Total_Per_100K",
      secondScale: false,
    },
    registered_auto: {
      name: "registered_auto",
      attribute: "registered_auto",
      secondScale: true,
    },
    registered_motorcycle: {
      name: "registered_motorcycle",
      attribute: "registered_motorcycle",
      secondScale: true,
    },
    registered_truck: {
      name: "registered_truck",
      attribute: "registered_truck",
      secondScale: true,
    },
    Car_Accidents_Per_Registration: {
      name: "Car_Accidents_Per_Registration",
      attribute: "Car_Accidents_Per_Registration",
      secondScale: true,
    },
    Motorcycle_Accident_Per_Registration: {
      name: "Motorcycle_Accident_Per_Registration",
      attribute: "Motorcycle_Accident_Per_Registration",
      secondScale: false,
    },
    Truck_Accidents_Per_Registration: {
      name: "Truck_Accidents_Per_Registration",
      attribute: "Truck_Accidents_Per_Registration",
      secondScale: false,
    },
    Registered_Cars_Per_Capita: {
      name: "Registered_Cars_Per_Capita",
      attribute: "Registered_Cars_Per_Capita",
      secondScale: false,
    }
  };

  var width = 660;
  var height = 520;
  var chart1 = d3
    .select("#chart1")
    .append("svg:svg")
    .attr("id", "svg1")
    .attr("width", width)
    .attr("height", height);

  var config = [];
  const addToConfig = (attribute, color) => {
    var attrExtent = d3.extent(csv, (row) => row[attribute]);
    var scale = d3.scaleLinear().domain(attrExtent).range([20, 450]);
    var uniqueId = "x" + Math.floor(Math.random() * 1000).toString();
    config = [
      ...config,
      {
        uniqueId,
        attribute,
        color,
        getAttr: (d) => d[attribute],
        scale,
      },
    ];
    generateCard(attribute, uniqueId, color);
    generateConfig();
  };

  const generateCard = (attribute, uniqueId, color) => {
    var cardHtml = `
    <div class="col m6 l12">
      <div id="c-${uniqueId}" data-target="dd-${uniqueId}" class="card dropdown-trigger change" style="background-color:${color}">
        <div class="card-content white-text">
            <span class="card-title">${opt[attribute].name}</span>
        </div>
      </div>
      <ul id="dd-${uniqueId}" class='dropdown-content change' style="margin-top:50px">
        <li><a href="#!" onclick="clicked('delete', '${uniqueId}')"><i class="material-icons">delete</i>Delete ${opt[attribute].name}</a></li>
        <li class="divider" tabindex="-1"></li>
      </ul>
    </div>`;
    var cards = document.getElementById("cards");
    cards.innerHTML = cards.innerHTML + cardHtml;
    var ddOptions = document.getElementById("dd-" + uniqueId);
    Object.values(opt).forEach((x) => {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.value = x.attribute;
      a.innerHTML = x.name;
      a.setAttribute("onclick", `clicked('${x.attribute}', '${uniqueId}')`);
      li.appendChild(a);
      ddOptions.appendChild(li);
    });
    var elems = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(elems, {});
    var ddContent = d3.selectAll(".dropdown-content.change");
    ddContent.selectAll("li").on("click", () => {
      changeConfigEvent();
    });
  };

  const ddInitialize = () => {
    var newList = document.getElementById("newList");
    Object.values(opt).forEach((x) => {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.value = x.attribute;
      a.innerHTML = x.name;
      a.setAttribute("onclick", `clicked('${x.attribute}', '0')`);
      li.appendChild(a);
      newList.appendChild(li);
    });
    var elems = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(elems, {});
    var ddContent = d3.selectAll(".dropdown-content.new");
    ddContent.selectAll("li").on("click", () => {
      addToConfig(clickedAttribute, pickColor());
    });
  };
  ddInitialize();

  const changeConfigEvent = () => {
    if (clickedAttribute == "delete") {
      d3.select("#c-" + origClicked).remove();
      d3.select("#dd-" + origClicked).remove();
      d3.selectAll("." + origClicked).remove();
      d3.select("#" + origClicked).remove();
      for (let i = 0; i < config.length; i++) {
        if (origClicked == config[i].uniqueId) {
          config.splice(i, 1);
        }
      }
      setTimeout(() => {
        generateConfig();
      }, 20);
      return;
    }
    var attribute = clickedAttribute;
    var index = 0;
    for (let i = 0; i < config.length; i++) {
      if (origClicked == config[i].uniqueId) {
        index = i;
      }
    }
    d3
      .select("#c-" + origClicked)
      .select("div")
      .select("span")
      .node().innerHTML = opt[attribute].name;
    d3
      .select("#dd-" + origClicked)
      .select("li")
      .select("a")
      .node().innerHTML = `<i class="material-icons">delete</i>Delete ${opt[attribute].name}`;
    changeConfig(attribute, index);
  };

  const changeConfig = (
    attribute,
    index,
    addCard = false,
    changeColor = false
  ) => {
    var attrExtent = d3.extent(csv, (row) => row[attribute]);
    var scale = d3.scaleLinear().domain(attrExtent).range([20, 460]);
    var color = changeColor ? pickColor() : config[index].color;

    config[index] = {
      uniqueId: config[index].uniqueId,
      attribute,
      color,
      getAttr: (d) => d[attribute],
      scale,
    };
    if (addCard) {
      generateCard(attribute, config[index].uniqueId, config[index].color);
    }
    generateScale();
    config.forEach((c) => {
      var scale = currentScale;
      if (opt[c.attribute].secondScale) {
        scale = currentScale2;
      }
      d3.select("#" + c.uniqueId)
        .transition()
        .attr("stroke", c.color)
        .attr(
          "d",
          d3
            .line()
            .x((row) => yearScale(row.Year))
            .y((row) => scale(c.getAttr(row)))
        );
      for (let i = 0; i < csv.length; i++) {
        d3.select("#" + c.uniqueId + "-" + i)
          .transition()
          .attr("fill", c.color)
          .attr("cy", scale(c.getAttr(csv[i])));
      }
    });
  };

  var generateConfig = () => {
    generateScale();
    config.forEach((c) => {
      var scale = currentScale;
      if (opt[c.attribute].secondScale) {
        scale = currentScale2;
      }
      if (!d3.select("#" + c.uniqueId).node()) {
        chart1
          .append("path")
          .attr("fill", "none")
          .attr("stroke", c.color)
          .attr("id", c.uniqueId)
          .datum(csv)
          .attr(
            "d",
            d3
              .line()
              .x((d) => yearScale(d.Year))
              .y((d) => scale(c.getAttr(d)))
          );

        for (let i = 0; i < csv.length; i++) {
          chart1
            .append("circle")
            .attr("cx", yearScale(csv[i].Year))
            .attr("cy", scale(c.getAttr(csv[i])))
            .attr("stroke", "none")
            .attr("fill", c.color)
            .attr("r", 3)
            .attr("class", c.uniqueId)
            .attr("id", c.uniqueId + "-" + i);
        }
      } else {
        d3.select("#" + c.uniqueId).attr(
          "d",
          d3
            .line()
            .x((row) => yearScale(row.Year))
            .y((row) => scale(c.getAttr(row)))
        );
        for (let i = 0; i < csv.length; i++) {
          d3.select("#" + c.uniqueId + "-" + i).attr(
            "cy",
            scale(c.getAttr(csv[i]))
          );
        }
      }
    });
  };

  chart1
    .append("g")
    .attr("class", "scaleY")
    .attr("transform", "translate(60,0)");

  var yearScale = d3
    .scaleLinear()
    .domain([csv[0].Year, csv[csv.length - 1].Year])
    .range([60, 600]);
  var xAxis = d3.axisBottom(yearScale).tickFormat(d3.format("d"));
  chart1
    .append("g")
    .attr("class", "scaleX")
    .attr("transform", "translate(0,480)")
    .call(xAxis);

  chart1
    .append("text")
    .attr("class", "labelX")
    .attr("text-anchor", "end")
    .attr("x", 330)
    .attr("y", 510)
    .text("y label");

  var generateScale = () => {
    var maxVal = 0;
    var maxVal2 = 0;
    config.forEach((c) => {
      if (!opt[c.attribute].secondScale) {
        maxVal = Math.max(maxVal, c.scale.domain()[1]);
      } else {
        maxVal2 = Math.max(maxVal2, c.scale.domain()[1]);
      }
    });

    currentScale = d3.scaleLinear().domain([maxVal, 0]).range([20, 480]);
    var yAxis = d3.axisLeft(currentScale);
    chart1.select(".scaleY").call(yAxis);

    if (maxVal2 != 0) {
      chart1
        .append("g")
        .attr("class", "scaleY2")
        .attr("transform", "translate(600,0)");
      currentScale2 = d3.scaleLinear().domain([maxVal2, 0]).range([20, 480]);
      var yAxis2 = d3.axisRight(currentScale2);
      chart1.select(".scaleY2").call(yAxis2);
    } else {
      chart1.select(".scaleY2").remove();
    }
  };

  /*addDataSelect = document.getElementById("addData");
  Object.values(opt).forEach((x) => {
    var selectOpt = document.createElement("option");
    selectOpt.value = x.attribute;
    selectOpt.innerHTML = x.name;
    addDataSelect.appendChild(selectOpt);
  });*/

  d3.select("#addData").on("change", () => {
    var attributeToAdd = d3.select("#addData").property("value");
    addToConfig(attributeToAdd, "black");
  });

  clearCards = () => {
    d3.selectAll(".card").remove();
  };

  modifyConfig = (attrList) => {
    clearCards();
    if (attrList.length < config.length) {
      console.log('here');
      for (let i = attrList.length; i < config.length; i++) {
        console.log(config[i].attribute)
        d3.selectAll("." + config[i].uniqueId).remove();
        d3.select("#" + config[i].uniqueId).remove();
      }
      console.log(config);
      config = config.splice(0, attrList.length);
      console.log(config);
    }
    for (let i = 0; i < attrList.length; i++) {
      if (config.length > i) {
        changeConfig(attrList[i], i, true, true);
      } else {
        console.log('addd');
        addToConfig(attrList[i], pickColor());
      }
    }
  };

  addToConfig("Motorcycle", pickColor());
  addToConfig("Car_Occupant", pickColor());

  d3.select("#preset1").on("click", () => {
    modifyConfig(["Car_Occupant", "registered_auto"]);
  });

  d3.select("#preset2").on("click", () => {
    modifyConfig(["Motorcycle", "registered_motorcycle"]);
  });

  d3.select("#preset3").on("click", () => {
    modifyConfig(["Car_Occupant", "registered_auto"]);
  });

  d3.select("#preset4").on("click", () => {
    modifyConfig(["Motorcycle", "registered_motorcycle"]);
  });
});

var origClicked = undefined;
var clickedAttribute = undefined;
function clicked(name, orig) {
  clickedAttribute = name;
  origClicked = orig;
}
