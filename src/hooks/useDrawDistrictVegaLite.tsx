import React, { useEffect, useState } from 'react'
import { Dimension } from '../types/dimension'
import embed from 'vega-embed'

import { Box } from '@mui/system'
import { Data } from '../types/Data'

const useDrawDistrictVegaLite = (district:string[],data:Data[])=>{
  const [dimension,setDimensions] = useState<Dimension>()
  const [spec,setSpec] = useState<Record<string,any>>()

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
    if(dimension && district && district.length && data && data.length){
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
              "url": `/data/maldiva.${d}.topojson.json`,
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
        
          
    })
    }
  },[dimension,district,data])
  
  if(spec)
    embed('#map',spec,{renderer:'svg'})
  
  const Map:React.FC = ()=>{
      return <Box>
          <Box id='panel-info'>

          </Box>
          <Box id={`map`}/>
          <Box id="tooltip" className="tooltip" style={{position:'absolute'}}/>
      </Box>
  }  
  return {Map}
}
export default useDrawDistrictVegaLite;