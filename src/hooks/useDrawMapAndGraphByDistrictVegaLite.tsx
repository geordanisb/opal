import React, { useEffect, useState } from 'react'
import { Dimension } from '../types/dimension'
import embed from 'vega-embed'

import { Box } from '@mui/system'
import { Data } from '../types/Data'

const useDrawMapAndGraphByDistrictVegaLite = (district:string[],data:Data[])=>{
  const [dimension,setDimensions] = useState<Dimension>()
  const [spec,setSpec] = useState<Record<string,any>>()
  const [specGraph,setSpecGraph] = useState<Record<string,any>>()


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

  const canDraw = ()=>dimension && district && district.length && data && data.length
  useEffect(()=>{
    if(canDraw()){
      const {width,height} = dimension
      setSpec({
        width,
        height,
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        columns:3,
        // layer:[
        //   {
        //     width,
        //     height,
        //     "data": {
        //       "url": `/data/maldiva.topojson.json`,
        //       "format": {
        //         "type": "topojson",
        //         "feature": "collection"
        //       }
        //     },
        //     "projection": {
        //       "type": "mercator",
        //     },
        //     "mark": {
        //       "type": "geoshape",
        //       "fill": "lightgray",
        //       "stroke": "white"
        //     }
        //   }
        // ]
        concat:district.map(d=>{
          return {
            width:300,
            height:300,
            "data": {
              "url": `/static/data/maldiva.${d}.topojson.json`,
              "format": {
                "type": "topojson",
                "feature": "collection"
              }
            },
            "projection": {
              "type": "mercator",
            },
            "mark": {
              "type": "geoshape",
              "fill": "lightgray",
              "stroke": "white"
            }
            
          }
        }),
        
          
      });
      setSpecGraph({
        width,
        height,
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        concat:district.map(d=>{
          return {
            width:300,
            height:300,
            data:{
              values:data
            },
            "mark": "bar",
            "transform": [
              {
                filter:`datum.district_out == '${d}' `
              },
              {
                filter:`datum.district_in != '${d}' `
              },
              {
                aggregate:[{
                  op:'sum',
                  field:'movement',
                  as:'movement_sum'
                }],
                groupby:['district_out','district_in']
              }
            ],
            "encoding": {
              "x": {"field": "district_in", "type": "nominal",title:'District In',axis:{labelAngle:0}},
              "y": {"field": "movement_sum", type:'quantitative',title:'Movement'},
              "color": {"field": "district_in", "type": "nominal",title:'District In'}
            }
          }
        }),
        
          
      })
    }
  },[dimension,district,data])
  
  if(canDraw() && spec)
    embed('#map',spec,{renderer:'svg'})

  if(canDraw() && specGraph)
    embed('#graph',specGraph,{renderer:'svg'}) 
  
  const Map:React.FC = ()=>{
      return <Box>
          <Box id='panel-info'>

          </Box>
          {canDraw() ? <Box id={`map`}/> : <></>}
          {canDraw() ? <Box id={`graph`}/> : <></>}

          <Box id="tooltip" className="tooltip" style={{position:'absolute'}}/>
      </Box>
  }  
  return {Map}
}
export default useDrawMapAndGraphByDistrictVegaLite;