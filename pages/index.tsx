import { Button, FormControl, FormGroup, Grid, Input, InputLabel, MenuItem, Select, Table, TableBody, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Box } from '@mui/system';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import * as d3 from 'd3'
// import * as vegaEmbeded from 'vega-embed'

export default function Home() {
  const [dimensions,setDimensions] = useState<{margin:number,width:number,height:number}>()
  const [district,setDistrict] = useState('male')
  

  // const drawStates = async (svg,states)=>{
  //   if(dimensions){
  //     const {margin,width,height} = dimensions
      

  //     // let zoom = d3.zoom()
  //     // .scaleExtent([1, 8])
  //     // .on('zoom', function(event) {
  //     //     svg.selectAll('path')
  //     //      .attr('transform', event.transform);
  //     // });
  //     // svg.call(zoom);
      
  //     // let geojson = await d3.json('/data/maldiva.geo.json');
  //     // if(district){
  //     //   const city = geojson.features.filter(i=>i.properties.name==district)
  //     //   geojson = {type:'FeatureCollection',features:city}
  //     // }

  //     let projection = d3.geoMercator().fitExtent([[margin, margin], [width - margin, height - margin]], states)
  //     const pathGenerator = d3.geoPath().projection(projection)
      
  //     const paths = svg.selectAll('path')
  //     .data(states)
  //     .join('path')
  //     .attr('d',pathGenerator)
  //     paths.classed('city',true)

  //     // var tooltip = d3.select("#tooltip")
    
  //     // paths.on('mouseenter',function(e,d){
  //     //   const $this = d3.select(this);
  //     //   tooltip.classed("show", true)
  //     //   tooltip.html(`<h5>${d.properties.label}</h5>`)

  //     // })
  //     // .on('mouseleave',function(e,d){
  //     //   const $this = d3.select(this) 
  //     //   tooltip.classed("show", false)

  //     // })
  //     // .on('mousemove',(e,d)=>{
  //     //   const left = e.offsetX; 
  //     //   const top = e.offsetY;

  //     //   console.log('pageY',e.pageY)
  //     //   console.log('offsetY',e.offsetY)


         
  //     //   tooltip.style('left',`${left}px`)
  //     //   tooltip.style('top',`${top}px`)

  //     // })

      

  //   }
  // }

  const draw = async ()=>{
    if(dimensions){
      const {margin,width,height} = dimensions
      
      let svg = d3.select('#map-current').html('<svg></svg>').select('svg').attr('width',width)
      .attr('height',height)

      let zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function(event) {
          svg.selectAll('path')
           .attr('transform', event.transform);
      });
      svg.call(zoom);
      
      let geojson = await d3.json(`/data/maldiva.${district}.json`);
      // if(district){
      //   const city = geojson.features.filter(i=>i.properties.name==district)
      //   geojson = {type:'FeatureCollection',features:city}
      // }

      let projection = d3.geoMercator().fitExtent([[margin, margin], [width - margin, height - margin]], geojson)
      const pathGenerator = d3.geoPath().projection(projection)
      
      const paths = svg.selectAll('path')
      .data(geojson.features)
      .join('path'
        // ,function(d){
        // debugger;
        // console.log(d);
        // const data = d.enter().data()
        // const states = data && data.length && data[0].states ? data[0].states : null;
        // if(states){
        //   let p = d3.geoMercator().fitExtent([[margin, margin], [width - margin, height - margin]], states)
        //   const pg = d3.geoPath().projection(p)
        //   svg.selectAll('path').join('path')
        //   .attr('d',pg)
        //   .attr('fill','red')
          

        // }
        // return d;
        // }
      )
      .attr('d',pathGenerator)
      // .attr('stroke','black')
      .classed('city',true)
      


      var tooltip = d3.select("#tooltip")
    
      paths.on('mouseenter',function(e,d){
        const $this = d3.select(this);
        tooltip.classed("show", true)
        tooltip.html(`<h5>${d.properties.label}</h5>`)

      })
      .on('mouseleave',function(e,d){
        const $this = d3.select(this) 
        tooltip.classed("show", false)

      })
      .on('mousemove',(e,d)=>{
        const left = e.offsetX; 
        const top = e.offsetY;

        console.log('pageY',e.pageY)
        console.log('offsetY',e.offsetY)


         
        tooltip.style('left',`${left}px`)
        tooltip.style('top',`${top}px`)

      })

      

    }
  }
  useEffect(()=>{
    setDimensions({
      width:window.innerWidth/2,
      height:window.innerHeight/2,
      margin:15
    })
  },[])

  useEffect(()=>{
    draw()
  },[district,dimensions])
    return <>
      {/* <button onClick={()=>draw('male')}>Draw male</button>
      <button onClick={()=>draw('kulhudhuffushi')}>Draw kulhudhuffushi</button>
      <button onClick={()=>draw('fuvahmulah')}>Draw fuvahmulah</button>
      <button onClick={()=>draw()}>Draw all</button> */}

      <Box padding={5}>
        <FormControl fullWidth>
          <InputLabel id="disctrict-lbl">District</InputLabel>
          <Select
            labelId="disctrict-lbl"
            id="disctrict-select"
            value={district}
            label="District"
            onChange={(e)=>setDistrict(e.target.value)}
          >
            {/* <MenuItem value=''>All</MenuItem> */}
            <MenuItem value='male'>Malé</MenuItem>
            {/* <MenuItem value='kulhudhuffushi'>Kulhudhuffushi</MenuItem> */}
            <MenuItem value='fuvahmulah'>Fuvahmulah</MenuItem>
          </Select>
        </FormControl>

      </Box>
      <section style={{position:'relative'}}>
        <div id="map-current"/>
        <div id="map-all"/>

        <div id="tooltip" className="tooltip" style={{position:'absolute'}}/>
          
      </section>

    </>
  
}

