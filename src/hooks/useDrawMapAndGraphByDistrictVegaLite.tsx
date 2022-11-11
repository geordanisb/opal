import React, { useEffect, useState } from 'react'
import { Dimension } from '../types/dimension'
import embed from 'vega-embed'
import * as d3 from 'd3'

import { Box } from '@mui/system'
import { DataMonthly, DataWeekly, DataYearly } from '../types/Data'
import { DistrictsMap } from '../constants'

type Data = DataMonthly|DataWeekly|DataYearly
const useDrawMapAndGraphByDistrictVegaLite = (district:string[],districtIn:string,districtOut:string,algorithm:string,data:Data[])=>{
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

  const canDraw = ()=>dimension && algorithm
    && ((district&&district.length) || (districtIn&&districtOut))
    && data && data.length

  useEffect(()=>{
    if(canDraw()){
      const {width,height} = dimension
const obj = [
{id:1001,movement:	100097},
{id:1003,movement:	50091},
{id:1005,movement:	410134},
{id:1007,movement:	1000121},
{id:1009,movement:	100099},
]
      if((districtOut&&districtIn)){
        let s = {
          width,
          height,
          $schema:'https://vega.github.io/schema/vega-lite/v5.json',
          columns:3,
          hconcat:[
            {
              width:width/3,
              height,
              "data": {
              "url": `/static/data/maldiva.${DistrictsMap[districtOut]}.topojson.json`,
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
                  name:'districtOut',
                  "mark": {
                    "type": "geoshape",
                    "fill": "lightgray",
                    "stroke": "white",
                    tooltip:districtOut
                  }
                },
                {
                  mark:{
                    type:'text',
                    text:`From ${districtOut}`,
                    fontWeight:'bold',
                    color:'black'
                  }
                }
              ]
            },
            {
              width:width/3,
              height,
              "data": {
              "url": `/static/data/maldiva.${DistrictsMap[districtIn]}.topojson.json`,
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
                  name:'districtIn',
                  "mark": {
                    "type": "geoshape",
                    "fill": "lightgray",
                    "stroke": "white",
                    tooltip:districtIn
                  }
                },
                {
                  mark:{
                    type:'text',
                    text:`To ${districtIn}`,
                    fontWeight:'bold',
                    color:'black'
                  }
                }
              ]
            },
            ... genBarGraphSpec(districtIn,width/3,height)
            ]
          }

          // setSpec(s);
          setSpec({
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "width": 500,
            "height": 300,
            "data": {
              "url": "/static/data/us-10m.json",
              "format": {
                "type": "topojson",
                "feature": "states"
              }
            },
            "transform": [
              {
                // filter:"(datum.id==1001)"
                filter:"(datum.id==15) || (datum.id==26) || (datum.id==48) || (datum.id==53) || (datum.id==54)"
              },
              
              {
                "lookup": "id",
                "from": {
                  "data": {
                    "url": "/static/data/us-states.json"
                  },
                  // data:{
                  //   values:obj
                  // },
                  "key": "id",
                  "fields": ["movement"]
                }
              },
              
            ],
            "projection": {
              "type": "albersUsa"
            },
            "mark": "geoshape",
            "encoding": {
              "color": {
                "field": "movement",
                "type": "quantitative"
              }
            }
          })

      }
      else{
        let s = {
          width,
          height,
          $schema:'https://vega.github.io/schema/vega-lite/v5.json',
          columns:2,
          hconcat:district.map(d=>({
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
                ... genBarGraphSpec(d,width/3,height)
              ]
          }))
        }
      setSpec(s);

      }


    }

  },[dimension,district,algorithm,data])

  const genBarGraphSpec = (d:string,width,height)=>{
    switch(algorithm){
      case 'movement':
        return genBarGraphSpecForMovement(d,width,height)
      case 'density':
          return genBarGraphSpecForDensity(d,width,height)
      case 'subscribers':
          return genBarGraphSpecForSubscribers(d,width,height)
      case 'events':
          return genBarGraphSpecForEvents(d,width,height)

    }
  }

  const genBarGraphSpecForMovement = (d:string,width:number,height:number)=>{
    return [{
      width,
      height,
      data:{
        values:data
      },
      transform: [
        {
          filter:`datum.district_out_encoded == '${d}' `
        },
        {
          filter:`datum.district_in_encoded != '${d}' `
        },
        {
          aggregate:[{
            op:'mean',
            field:'movement',
            as:'movement_mean'
          }],
          groupby:['district_out_encoded','district_in_encoded']
        }
      ],
      encoding: {
        "x": {"field": "district_in_encoded", "type": "nominal",title:'District In',axis:{labelAngle:0}},
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
            color: {"field": "district_in_encoded", "type": "nominal",title:'District In'}
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

  const genBarGraphSpecForDensity = (d:string,width:number,height:number)=>{
    return [{
      width,
      height,
      data:{
        values:data
      },
      transform: [
        {
          filter:`datum.district_out_encoded == '${d}' `
        },
        {
          filter:`datum.district_in_encoded != '${d}' `
        },
        {
          aggregate:[{
            op:'mean',
            field:'density',
            as:'density_mean'
          }],
          groupby:['district_out_encoded','district_in_encoded']
        }
      ],
      encoding: {
        "x": {"field": "district_in_encoded", "type": "nominal",title:'District In',axis:{labelAngle:0}},
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
            color: {"field": "district_in_encoded", "type": "nominal",title:'District In'}
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

  const genBarGraphSpecForSubscribers = (d:string,width:number,height:number)=>{
    return [{
      width,
      height,
      data:{
        values:data
      },
      transform: [
        {
          filter:`datum.district_out_encoded == '${d}' `
        },
        {
          filter:`datum.district_in_encoded != '${d}' `
        },
        {
          aggregate:[{
            op:'mean',
            field:'subscribers',
            as:'subscribers_sum'
          }],
          groupby:['district_out_encoded','district_in_encoded']
        }
      ],
      encoding: {
        "x": {"field": "district_in_encoded", "type": "nominal",title:'District In',axis:{labelAngle:0}},
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
            color: {"field": "district_in_encoded", "type": "nominal",title:'District In'}
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

  const genBarGraphSpecForEvents = (d:string,width:number,height:number)=>{
    return [
      {
        width,
        height,
        data:{
          values:data
        },
        transform: [
          {
            filter:`datum.district_out_encoded == '${d}' `
          },
          {
            filter:`datum.district_in_encoded != '${d}' `
          },
          {
            aggregate:[{
              op:'sum',
              field:'average_call_duration',
              as:'average_call_duration_sum'
            }],
            groupby:['district_out_encoded','district_in_encoded']
          }
        ],
        encoding: {
          "x": {"field": "district_in_encoded", "type": "nominal",title:'District In',axis:{labelAngle:0}},
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
              color: {"field": "district_in_encoded", "type": "nominal",title:'District In'}
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
        width,
        height,
        data:{
          values:data
        },
        transform: [
          {
            filter:`datum.district_out_encoded == '${d}' `
          },
          {
            filter:`datum.district_in_encoded != '${d}' `
          },
          {
            aggregate:[{
              op:'sum',
              field:'sms_out',
              as:'sms_in_sum'
            }],
            groupby:['district_out_encoded','district_in_encoded']
          }
        ],
        encoding: {
          "x": {"field": "district_in_encoded", "type": "nominal",title:'District In',axis:{labelAngle:0}},
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
              color: {"field": "district_in_encoded", "type": "nominal",title:'District In'}
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
        width,
        height,
        data:{
          values:data
        },
        transform: [
          {
            filter:`datum.district_out_encoded == '${d}' `
          },
          {
            filter:`datum.district_in_encoded != '${d}' `
          },
          {
            aggregate:[{
              op:'sum',
              field:'sms_out',
              as:'sms_out_sum'
            }],
            groupby:['district_out_encoded','district_in_encoded']
          }
        ],
        encoding: {
          "x": {"field": "district_in_encoded", "type": "nominal",title:'District In',axis:{labelAngle:0}},
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
              color: {"field": "district_in_encoded", "type": "nominal",title:'District In'}
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

  // if(canDraw() && spec)
  //   embed('#map',spec,{renderer:'svg'})
  if(canDraw() && spec){
    const p = new Promise((resolve,reject)=>{
      resolve(embed('#map',spec,{renderer:'svg'}))
    }).then(r=>{
      if(!(districtIn&&districtOut))return;
      const out = d3.select(".districtOut_marks")
      const outPath = out.select("path")
      let psOut = {bounds:undefined}
      outPath.each(p=>{
        psOut.bounds = p.bounds
      })

      const IN = d3.select(".districtIn_marks")
      const inPath = IN.select("path")
      let psIn = {bounds:undefined}
      inPath.each(p=>{
        psIn.bounds = p.bounds
      })

      const drawCircle = (ps,g)=>{
        if(ps.bounds){
          const {x2,x1,y2,y1} = ps.bounds;
          const m ={
            x:(x1+x2)/2,
            y:(y1+y2)/2
          }
          g.append('circle')
            .attr('cx', m.x)
            .attr('cy', m.y+10)
            .attr('r', 5)
            .attr('stroke', 'gray')
            .attr('fill', '#1976d2');
            return {x:m.x,y:m.y+10};
        }
        return undefined;
      }

      const drawLine = (m1,m2)=>{
        const points = [{x:m1.x,y:m1.y},{x:m2.x,y:m2.y}]
        const lineFunc = d3.line()
          .x(function(d) { return d.x })
          .y(function(d) { return d.y })

        const g = d3.select('svg > g')
        g.append('path')
        .attr('d', lineFunc(points))
        .attr('stroke', '#1976d2')
        .attr('fill', 'none');

      }

      const pOut = drawCircle(psOut,out)
      const pIn = drawCircle(psIn,IN)

      if(pOut && pIn)
        drawLine(pOut,{x:pOut.x+(dimension.width/3)+dimension.margin,y:pOut.y})


    })

  }




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