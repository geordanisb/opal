import React, { useEffect, useState } from 'react'
import { Dimension } from '../types/dimension'
import embed from 'vega-embed'

import { Box } from '@mui/system'
import { DataMonthly, DataWeekly, DataYearly } from '../types/Data'

type Data = DataMonthly|DataWeekly|DataYearly
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
        $schema:'https://vega.github.io/schema/vega-lite/v5.json',
        rows:district.length,
        vconcat:district.map(d=>({
            width,
            height,
            hconcat:[
              {
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
                layer:[
                  {
                    "mark": {
                      "type": "geoshape",
                      "fill": "lightgray",
                      "stroke": "white",
                      tooltip:d
                    }
                  },
                  {
                    mark:{
                      type:'text',
                      text:d,
                      fontWeight:'bold',
                      color:'black'
                    }
                  }
                ]
              },
              {
                width:300,
                height:300,
                data:{
                  values:data
                },
                transform: [
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
                encoding: {
                  "x": {"field": "district_in", "type": "nominal",title:'District In',axis:{labelAngle:0}},
                  "y": {"field": "movement_sum", type:'quantitative',title:'Movement'},
                },
                layer:[
                  {
                    mark: {
                      type:"bar",
                      cornerRadiusEnd:4,
                      tooltip:true
                    },
                    encoding:{
                      color: {"field": "district_in", "type": "nominal",title:'District In'}
                    },
                  },
                  {
                    mark:{
                      type:'text',
                      dy:10,
                      shape:'square',
                      color:'white',
                      fontWeight:'bold',
                    },
                    encoding:{text:{field:'movement_sum',format:'s'}}
                  }
                
                ]
              }
            ]
        }))
      });
    }
  },[dimension,district,data])
  
  if(canDraw() && spec)
    embed('#map',spec,{renderer:'svg'})
  
  const Map:React.FC = ()=>{
      return <Box sx={{marginBottom:'4em'}}>
          <Box id='panel-info'/>
          {canDraw() ? <Box id={`map`}/> : <></>}
          <Box id="tooltip" className="tooltip" style={{position:'absolute'}}/>
      </Box>
  }  
  return {Map}
}
export default useDrawMapAndGraphByDistrictVegaLite;