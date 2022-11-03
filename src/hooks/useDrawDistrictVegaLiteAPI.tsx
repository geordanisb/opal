import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Dimension } from '../types/dimension'
import * as vega from 'vega'
import * as vegaLite from 'vega-lite'
import * as vl from 'vega-lite-api'

const useDrawDistrictVegaLiteAPI = (district:string)=>{
  const [dimension,setDimensions] = useState<Dimension>()

  useEffect(()=>{
  const d = {
    width:window.innerWidth/2,
    height:window.innerHeight/2,
    margin:15,
    ctrWidth:(window.innerWidth/2)-15*2,
    ctrHeight:(window.innerHeight/2)-15*2,
  }
  setDimensions(d)

  vl.register(vega,vegaLite,{
    init:(view)=>{
      console.log('view',view)
    }
  })
  
  },[])

  useEffect(()=>{
    if(dimension && district){
      const {width,height} = dimension
      
      const map = vl.markGeoshape({
        fill:'lightgray',
        stoke:'white'
      })
      .data(vl.topojson(`/data/maldiva.${district}.topojson.json`).feature('collection'))
      .width(width)
      .height(Math.floor(width / 1.75))
      
      vl.layer(map)
      .render({renderer: 'svg'})
      .then(viewElement=>{
        document.getElementById('map').appendChild(viewElement)
      })
      
    }
  },[dimension,district])
  
  
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
export default useDrawDistrictVegaLiteAPI;