import React, { useEffect, useState } from 'react'
import { Dimension } from '../types/dimension'
import * as d3 from 'd3'
import { Box } from '@mui/system'

const useDrawDistrict = (district:string,geojson:any)=>{
    const [dimensions,setDimensions] = useState<Dimension>()

    useEffect(()=>{
        const d = {
          width:window.innerWidth/2,
          height:window.innerHeight/2,
          margin:15,
          ctrWidth:(window.innerWidth/2)-15*2,
          ctrHeight:(window.innerHeight/2)-15*2,
    
        }
        setDimensions(d)
      },[])

      useEffect(()=>{
        const fn = async ()=>{
            if(dimensions && district && geojson){
                const {margin,width,height,ctrWidth,ctrHeight} = dimensions
                let svg = d3.select(`#map-${district}`).html('<svg></svg>').select('svg')
                .attr('width',width)
                .attr('height',height)
          
                let zoom = d3.zoom()
                .scaleExtent([1, 8])
                .on('zoom', function(event) {
                    svg.selectAll('path')
                     .attr('transform', event.transform);
                });
                svg.call(zoom);
                
                // if(district){
                //   const city = geojson.features.filter(i=>i.properties.name==district)
                //   geojson = {type:'FeatureCollection',features:city}
                // }
          
                let projection = d3.geoMercator().fitExtent([[margin, margin], [ctrWidth, ctrHeight]], geojson)
                const pathGenerator = d3.geoPath().projection(projection)
          
                const ctr = svg.append('g')
                const paths = ctr.selectAll('path')
                .data(geojson.features)
                .join('path')
                .attr('d',pathGenerator)
                .classed('city',true)
          
                const tooltip = d3.select("#tooltip")
              
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
                  const left = e.clientX; 
                  const top = e.clientY;
                   
                  tooltip.style('left',`${left}px`)
                  tooltip.style('top',`${top}px`)
                })
          
            }
        }
        fn()
      },[dimensions,district,geojson])
    
      
    const Map:React.FC = ()=>{
        return <Box>
            <Box id='panel-info'>

            </Box>
            <Box id={`map-${district}`}/>
            <Box id="tooltip" className="tooltip" style={{position:'absolute'}}/>
        </Box>
    }  
    return {Map}
}
export default useDrawDistrict;