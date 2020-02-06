import React from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';


class Congressional extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            usData: null,
            congressionalData: null,
            loadComplete: false
        }
    }

    componentDidMount(){    
        Promise.all([
            d3.json('https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/components/topojson/examples/us-10m.json'),
            d3.json('https://gist.githubusercontent.com/mroswell/7817916/raw/d0e8fc44dc098b787ebba27ebb86c24d2e89c998/us-congress-113.json')
        ]).then( ([usData, congressionalData]) => {
            console.log(usData)
            this.setState({
                usData,
                congressionalData,
                loadComplete: true
            })
        }).catch(err => console.log('Error loading or parsing data.'))
    }

    componentDidUpdate(){
        
        const {width, height} = this.props;
        const { usData: us, congressionalData: congress } = this.state;
       
        const svg = d3.select(this.refs.anchor);

        const projection = d3.geoAlbers()
                .scale(1280)
                .translate([width / 2, height / 2]);

        const path = d3.geoPath(projection);

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

    render(){

        const { usData, congressionalData } = this.state;   

        if (!usData || !congressionalData) return null;

        return <g ref='anchor'></g>
    }
}

export default Congressional;