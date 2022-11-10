import React, { useEffect, useState } from 'react'
import { Dimension } from '../types/dimension'
import embed from 'vega-embed'

import { Box } from '@mui/system'
import { DataMonthly, DataWeekly, DataYearly } from '../types/Data'

type Data = DataMonthly|DataWeekly|DataYearly
const useDrawMapAndGraphByDistrictVegaLite = (district:string[],districtIn:string,districtOut:string,algorithm:string,data:Data[])=>{
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

  const canDraw = ()=>dimension && algorithm 
    && ((district&&district.length) || (districtIn&&districtOut)) 
    && data && data.length

  useEffect(()=>{
    if(canDraw()){
      const {width,height} = dimension
      
      if((districtOut&&districtIn)){
        const dss = [districtOut,districtIn]

        let s = {
          width,
          height,
          $schema:'https://vega.github.io/schema/vega-lite/v5.json',
          rows:1,
          hconcat:dss.map(d=>({
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
                ... genBarGraphSpec(d)
              ]
          }))
        }
      setSpec(s);

      } 
      else{
        let s = {
          width,
          height,
          $schema:'https://vega.github.io/schema/vega-lite/v5.json',
          rows:district.length,
          vconcat:district.map(d=>({
              width,
              height,
              columns:3,
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
                ... genBarGraphSpec(d)
              ]
          }))
        }
      setSpec(s);

      } 
    }
  },[dimension,district,algorithm,data])

  const genBarGraphSpec = (d:string)=>{
    switch(algorithm){
      case 'movement':
        return genBarGraphSpecForMovement(d)
      case 'density':
          return genBarGraphSpecForDensity(d)
      case 'subscribers':
          return genBarGraphSpecForSubscribers(d)
      case 'events':
          return genBarGraphSpecForEvents(d)    

    }
  }

  const genBarGraphSpecForMovement = (d:string)=>{
    return [{
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
            op:'mean',
            field:'movement',
            as:'movement_mean'
          }],
          groupby:['district_out','district_in']
        }
      ],
      encoding: {
        "x": {"field": "district_in", "type": "nominal",title:'District In',axis:{labelAngle:0}},
        "y": {"field": "movement_mean", type:'quantitative',title:'Movement (MEAN)'},
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
          encoding:{text:{field:'movement_mean',format:'s'}}
        }
      
      ]
    }]
  }

  const genBarGraphSpecForDensity = (d:string)=>{
    return [{
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
            op:'mean',
            field:'density',
            as:'density_mean'
          }],
          groupby:['district_out','district_in']
        }
      ],
      encoding: {
        "x": {"field": "district_in", "type": "nominal",title:'District In',axis:{labelAngle:0}},
        "y": {"field": "density_mean", type:'quantitative',title:'Density (MEAN)'},
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
          encoding:{text:{field:'density_mean',format:'s'}}
        }
      
      ]
    }]
  }

  const genBarGraphSpecForSubscribers = (d:string)=>{
    return [{
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
            op:'mean',
            field:'subscribers',
            as:'subscribers_sum'
          }],
          groupby:['district_out','district_in']
        }
      ],
      encoding: {
        "x": {"field": "district_in", "type": "nominal",title:'District In',axis:{labelAngle:0}},
        "y": {"field": "subscribers_sum", type:'quantitative',title:'Subscribers (MEAN)'},
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
          encoding:{text:{field:'subscribers_sum',format:'s'}}
        }
      
      ]
    }]
  }

  const genBarGraphSpecForEvents = (d:string)=>{
    return [
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
              field:'average_call_duration',
              as:'average_call_duration_sum'
            }],
            groupby:['district_out','district_in']
          }
        ],
        encoding: {
          "x": {"field": "district_in", "type": "nominal",title:'District In',axis:{labelAngle:0}},
          "y": {"field": "average_call_duration_sum", type:'quantitative',title:'Average call duration (SUM)'},
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
            encoding:{text:{field:'average_call_duration_sum',format:'s'}}
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
              field:'sms_out',
              as:'sms_in_sum'
            }],
            groupby:['district_out','district_in']
          }
        ],
        encoding: {
          "x": {"field": "district_in", "type": "nominal",title:'District In',axis:{labelAngle:0}},
          "y": {"field": "sms_in_sum", type:'quantitative',title:'SMS in (SUM)'},
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
            encoding:{text:{field:'sms_in_sum',format:'s'}}
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
              field:'sms_out',
              as:'sms_out_sum'
            }],
            groupby:['district_out','district_in']
          }
        ],
        encoding: {
          "x": {"field": "district_in", "type": "nominal",title:'District In',axis:{labelAngle:0}},
          "y": {"field": "sms_out_sum", type:'quantitative',title:'SMS out (SUM)'},
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
            encoding:{text:{field:'sms_out_sum',format:'s'}}
          }
        
        ]
      }
    ]
  }
  
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