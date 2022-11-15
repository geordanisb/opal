import React, { useEffect, useState } from 'react'
import { Dimension } from '../types/dimension'
import embed from 'vega-embed'

import { Box } from '@mui/system'
import { MonthlyMobilityEvent, Topic, WeeklyMobilityEvent, YearlyMobilityEvent } from '../types/Data'

type Data = MonthlyMobilityEvent|WeeklyMobilityEvent|YearlyMobilityEvent
const useDrawMapMovilityAndEvents = (districtOut:string,districtIn:string,topic:Topic,data:Data[],doRender=false)=>{
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

  const canDraw = ()=>doRender && dimension && topic
    && (districtIn&&districtOut)
    && data && data.length
    
  useEffect(()=>{
    if(canDraw()){
      const {width,height} = dimension
      let districts = [districtOut,districtIn];
      const isEvent = ['call_out','sms_out'].includes(topic) 
      let aggregate = isEvent ? 'sum' : 'mean'
      
      const colorDomain = {
        sms_out: [50e6,100e6,150e6,250e6,300e6],
        call_out: [5e6,10e6,15e6,20e6,25e6],
        movement: [100,200,300,400,500],
        // average_call_duration: [0-100[, [100-300[, [300-500[, [500-800[, <800
      }
      const info = data.reduce((p,c)=>{
        if(c.district_out == c.district_in)return p;
        const k = `${c['district_out']}-${c['district_in']}`
        if(!(k in p)){
            p[k] = {sum:+c[topic],count:1,mean:+c[topic]/1}
        }
        else{
          p[k].sum += +c[topic];
          p[k].count += 1;
          p[k].mean = p[k].sum/p[k].count
        }
        return p;
      },{})
      console.log('data',data)
      console.log('info',info)
      
      setSpec({
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        width,
        height,
        layer:[
          //district_out map
          {
            data:{
              values:data
            },
            "transform": [
              {
                aggregate:[{
                  op:aggregate,
                  field:topic,
                  as:`${topic}` 
                }],
                groupby:['district_in','district_out']
              },
              {
                "lookup": 'district_out',
                "from": {
                  "data": {
                    "url": "/static/data/us-10m.json",
                    "format": {
                      "type": "topojson",
                      "feature": "states",
                    },
                  },
                  "key": "id"
                },
                "as": "geo"
              },
              {
                  "lookup": "district_out",
                  "from": {
                    "data": {
                      "url": "/static/data/us-states.json"
                    },
                    "key": "id",
                    "fields": ["label"]
                  },
                  "as": ["label"]
              }
            ],
            "projection": {"type": "albersUsa"},
            "mark": {
              type:"geoshape",
              ... !isEvent 
                ? {fill:'gainsboro'}
                : {}
            },
            "encoding": {
              "shape": {
                "field": "geo",
                "type": "geojson",
              },
              ... isEvent
              ? {
                "color": {
                  "field": `${topic}`,
                  // type:"ordinal"
                  "type": "quantitative",
                  scale:{
                    // domain:colorDomain[topic],
                    range:['#c3ddf4','#6fa7db','#0e4d8b']
                  }
                },
              }
              :{},
              tooltip:[
                {
                  field:'label',
                  title:'District'
                }
              ]
            }
          },
          // //district_in map
          {
            data:{
              values:data
            },
            "transform": [
              {
                aggregate:[{
                  op:aggregate,
                  field:topic,
                  as:`${topic}` 
                }],
                groupby:['district_in','district_out']
              },
              {
                "lookup": 'district_in',
                "from": {
                  "data": {
                    "url": "/static/data/us-10m.json",
                    "format": {
                      "type": "topojson",
                      "feature": "states",
                    },
                  },
                  "key": "id"
                },
                "as": "geo"
              },
              {
                  "lookup": "district_in",
                  "from": {
                    "data": {
                      "url": "/static/data/us-states.json"
                    },
                    "key": "id",
                    "fields": ["label"]
                  },
                  "as": ["label"]
              }
            ],
            "projection": {"type": "albersUsa"},
            "mark": {
              type:"geoshape",
              ... !isEvent 
                ? {fill:'cadetblue'}
                : {}
            },
            "encoding": {
              "shape": {
                "field": "geo",
                "type": "geojson",
              },
              ... isEvent 
              ? {
                "color": {
                  "field": `${topic}`,
                  // type:"ordinal"
                  "type": "quantitative",
                  scale:{
                    // domain:colorDomain[topic],
                    range:['#c3ddf4','#6fa7db','#0e4d8b']
                  }
                },
              }
              : {},
              tooltip:[
                {
                  field:'label',
                  title:'District'
                }
              ]
            }
          },
          //for circles
          {
            "data": {
              "url": "/static/data/us-states.json"
            },
            transform:[
              {
                filter:{
                  field:'id',
                  oneOf:districts
                }
              }
            ],
            "projection": {
              "type": "albersUsa"
            },
            "mark": {
              type:"circle",
              tooltip:{content:'encoding'}
            },
            "encoding": {
              "longitude": {
                "field": "longitude",
                "type": "quantitative"
              },
              "latitude": {
                "field": "latitude",
                "type": "quantitative"
              },
              "size": {"value": 100},
              "color": {"value": "orange"},
              'stroke':{value:'navy'}
            }
          },
          // for lines  
          {
            "data": {
              values:data
            },
            "transform": [
              // {
              //   filter:`datum.district_out == ${districtOut} && datum.district_in == ${districtIn}`
              // },
              {
                "lookup": 'district_out',
                "from": {
                  "data": {
                    "url": "/static/data/us-states.json"
                  },
                  "key": "id",
                  "fields": ["latitude", "longitude","label"]
                },
                "as": ["origin_latitude", "origin_longitude","district_label_out"]
              },
              {
                "lookup": "district_in",
                "from": {
                  "data": {
                    "url": "/static/data/us-states.json"
                  },
                  "key": "id",
                  "fields": ["latitude", "longitude","label"]
                },
                "as": ["dest_latitude", "dest_longitude","district_label_in"]
              }
            ],
            "projection": {
              "type": "albersUsa",
            },
            "mark": {
              type:"rule",
              stroke:'orange',
              strokeWidth:2,
              tooltip:{content:'data'}
            },
            "encoding": {
              "longitude": {"field": "origin_longitude"},
              "latitude": {"field": "origin_latitude"},
              "longitude2": {"field": "dest_longitude"},
              "latitude2": {"field": "dest_latitude"},
              tooltip:[
                {field:'district_label_out',title:'From'},
                {field:'district_label_in',title:'To'},
                {field:topic,title:`${topic}`.toUpperCase()},
              ],
              
            }
          }
        ]
      })
    }

  },[doRender,dimension,topic,data])


  // if(canDraw() && spec)
  //   embed('#map',spec,{renderer:'svg'})
  if(canDraw() && spec){
    const p = new Promise((resolve,reject)=>{
      resolve(embed('#map',spec,{renderer:'svg'}))
    }).then(r=>{
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
export default useDrawMapMovilityAndEvents;