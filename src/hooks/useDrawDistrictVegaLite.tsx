import React, { useEffect, useState } from 'react'
import { Dimension } from '../types/dimension'
import embed from 'vega-embed'

import { Box } from '@mui/system'

const useDrawDistrictVegaLite = (district:string)=>{
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
    if(dimension && district){
      const {width,height} = dimension
      setSpec({
        width,
        height,
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        layer:[
          {
            "data": {
              "url": `/data/maldiva.${district}.topojson.json`,
              "format": {
                "type": "topojson",
                "feature": "collection"
              }
            },
            "mark": {
              "type": "geoshape",
              "fill": "lightgray",
              "stroke": "white"
            }
          }
        ]
          
    })
    }
  },[dimension,district])
  
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