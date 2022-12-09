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
    csv[i].Car_Per_100K = Number(csv[i].Car_Per_100K);
    csv[i].Ped_Per_100K = Number(csv[i].Ped_Per_100K);
    csv[i].Motorcycle_Per_100K = Number(csv[i].Motorcycle_Per_100K);
    csv[i].Bicycle_Per_100K = Number(csv[i].Bicycle_Per_100K);
    csv[i].Trucks_Per_100K = Number(csv[i].Trucks_Per_100K);
    csv[i].Total_Per_100K = Number(csv[i].Total_Per_100K);
    csv[i].registered_auto = Number(csv[i].registered_auto);
    csv[i].registered_motorcycle = Number(csv[i].registered_motorcycle);
    csv[i].rate_per_registered_auto = Number(csv[i].rate_per_registered_auto);
    csv[i].rate_per_registered_motorcycle = Number(
      csv[i].rate_per_registered_motorcycle
    );
    csv[i].car_vs_motorcycle = Number(csv[i].car_vs_motorcycle);
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
  var opt = {
    Population: {
      name: "Population",
      attribute: "Population",
      secondScale: false,
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
      secondScale: false,
    },
    registered_motorcycle: {
      name: "registered_motorcycle",
      attribute: "registered_motorcycle",
      secondScale: false,
    },
    rate_per_registered_auto: {
      name: "rate_per_registered_auto",
      attribute: "rate_per_registered_auto",
      secondScale: false,
    },
    rate_per_registered_motorcycle: {
      name: "rate_per_registered_motorcycle",
      attribute: "rate_per_registered_motorcycle",
      secondScale: false,
    },
    car_vs_motorcycle: {
      name: "car_vs_motorcycle",
      attribute: "car_vs_motorcycle",
      secondScale: false,
    },
  };

  var width = 600;
  var height = 500;
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
    var uniqueId = "x" + Math.floor(Math.random() * 100).toString();
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

    var cardHtml = `
    <div id="c-${uniqueId}" data-target="dd-${uniqueId}" class="card dropdown-trigger change" style="background-color:${color}">
      <div class="card-content white-text">
          <span class="card-title">${opt[attribute].name}</span>
      </div>
    </div>
    <ul id="dd-${uniqueId}" class='dropdown-content change' style="margin-top:50px">
      <li><a href="#!" onclick="clicked('delete', '${uniqueId}')"><i class="material-icons">delete</i>Delete ${opt[attribute].name}</a></li>
      <li class="divider" tabindex="-1"></li>
    </ul>`;
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
      changeConfig();
    });
    ddInitialize();
    generateConfig();
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

  const changeConfig = () => {
    console.log(clickedAttribute);
    if (clickedAttribute == "delete") {
      d3.select("#c-" + origClicked).remove();
      d3.select("#dd-" + origClicked).remove();
      for (let i = 0; i < config.length; i++) {
        if (origClicked == config[i].uniqueId) {
          config.splice(i, 1);
        }
      }
      clear(false);
      setTimeout(() => {
        generateConfig();
      }, 20);
      return;
    }
    var attribute = clickedAttribute;
    var attrExtent = d3.extent(csv, (row) => row[attribute]);
    var scale = d3.scaleLinear().domain(attrExtent).range([20, 460]);
    var index = 0;
    for (let i = 0; i < config.length; i++) {
      if (origClicked == config[i].uniqueId) {
        console.log(origClicked + " 000 " + config[i].uniqueId);
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
    config[index] = {
      uniqueId: config[index].uniqueId,
      attribute,
      color: config[index].color,
      getAttr: (d) => d[attribute],
      scale,
    };
    generateScale();
    config.forEach((c) => {
      d3.select("#" + c.uniqueId)
        .transition()
        .attr(
          "d",
          d3
            .line()
            .x((row) => yearScale(row.Year))
            .y((row) => currentScale(c.getAttr(row)))
        );
      for (let i = 0; i < csv.length; i++) {
        d3.select("#" + c.uniqueId + "-" + i)
          .transition()
          .attr("cy", currentScale(c.getAttr(csv[i])));
      }
    });
  };

  var generateConfig = () => {
    generateScale();
    config.forEach((c) => {
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
              .y((d) => currentScale(c.getAttr(d)))
          );

        for (let i = 0; i < csv.length; i++) {
          chart1
            .append("circle")
            .attr("cx", yearScale(csv[i].Year))
            .attr("cy", currentScale(c.getAttr(csv[i])))
            .attr("stroke", "none")
            .attr("fill", c.color)
            .attr("r", 3)
            .attr("class", c.uniqueId)
            .attr("id", c.uniqueId + "-" + i);
        }
      } else {
        d3.select("#" + c.uniqueId)
          .transition()
          .attr(
            "d",
            d3
              .line()
              .x((row) => yearScale(row.Year))
              .y((row) => currentScale(c.getAttr(row)))
          );
        for (let i = 0; i < csv.length; i++) {
          d3.select("#" + c.uniqueId + "-" + i)
            .transition()
            .attr("cy", currentScale(c.getAttr(csv[i])));
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

  var yAxis = d3.axisBottom(yearScale);
  chart1
    .append("g")
    .attr("class", "scaleX")
    .attr("transform", "translate(0,480)")
    .call(yAxis)
    .select(".domain")
    .remove();

  var generateScale = () => {
    var maxVal = 0;
    config.forEach((c) => {
      maxVal = Math.max(maxVal, c.scale.domain()[1]);
    });

    currentScale = d3.scaleLinear().domain([maxVal, 0]).range([20, 480]);
    var xAxis = d3.axisLeft(currentScale);
    chart1.select(".scaleY").call(xAxis);
  };

  addDataSelect = document.getElementById("addData");
  Object.values(opt).forEach((x) => {
    var selectOpt = document.createElement("option");
    selectOpt.value = x.attribute;
    selectOpt.innerHTML = x.name;
    addDataSelect.appendChild(selectOpt);
  });

  d3.select("#addData").on("change", () => {
    var attributeToAdd = d3.select("#addData").property("value");
    addToConfig(attributeToAdd, "black");
  });

  addToConfig("Motorcycle", pickColor());
  addToConfig("Car_Occupant", pickColor());

  clear = (clearCard = true) => {
    d3.selectAll("path").remove();
    d3.selectAll("circle").remove();
    if (clearCard) {
      d3.selectAll(".card").remove();
    }
  };

  d3.select("#test").on("click", () => {
    clear();
    config = [];
    addToConfig("Motorcycle", pickColor());
    addToConfig("Car_Occupant", pickColor());
    addToConfig("Total", pickColor());
    generateConfig();
  });
});
var origClicked = undefined;
var clickedAttribute = undefined;
function clicked(name, orig) {
  clickedAttribute = name;
  origClicked = orig;
}
