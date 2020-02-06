/** step 1: setting geographical projections */
var width = 960,
    height = 600;

var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

/** step 2: setting up the svg to draw and query for data*/
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/components/topojson/examples/us-10m.json")
    .defer(d3.json, "https://gist.githubusercontent.com/mroswell/7817916/raw/d0e8fc44dc098b787ebba27ebb86c24d2e89c998/us-congress-113.json")
    .await(ready); // callback

/** step 3: callback function to call once the fetching is done */
function ready(error, us, congress) {
  if (error) throw error;

  svg.append("defs").append("path")
      .attr("id", "land")
      .datum(topojson.feature(us, us.objects.land))
      .attr("d", path)

  svg.append("clipPath")
      .attr("id", "clip-land")
    .append("use")
      .attr("xlink:href", "#land");

  svg.append("g")
      .attr("class", "districts")
      .attr("clip-path", "url(#clip-land)")
    .selectAll("path")
      .data(topojson.feature(congress, congress.objects.districts).features)
    .enter().append("path")
      .attr("d", path)
    .append("title")
      .text(function(d) { return d.id; }); // is the displays the count on hover 

  svg.append("path")
      .attr("class", "district-boundaries")
      .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
      .attr("d", path);

  svg.append("path")
      .attr("class", "state-boundaries")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("d", path);
}

d3.select(self.frameElement).style("height", height + "px");