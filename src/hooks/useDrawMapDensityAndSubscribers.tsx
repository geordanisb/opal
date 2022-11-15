
import React, { useEffect, useState } from 'react'
import { Dimension } from '../types/dimension'
import embed from 'vega-embed'

import { Box } from '@mui/system'
import { MonthlyDensitySubscriber, Topic, WeeklyDensitySubscriber, YearlyDensitySubscriber } from '../types/Data'

type Data = MonthlyDensitySubscriber|WeeklyDensitySubscriber|YearlyDensitySubscriber
const useDrawMapDensityAndSubscribers = (district:string[],topic:Topic,data:Record<string,any>[],doRender=false)=>{
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
    && (district&&district.length)
    && data && data.length
    
  useEffect(()=>{
    if(canDraw()){
      const {width,height} = dimension
      let aggregate = topic == 'density' ? 'mean' : 'sum'
      
      const colorDomain = {
        subscribers: [50e6,100e6,150e6,250e6,300e6],
        density: [100,200,300,400,500],
        // average_call_duration: [0-100[, [100-300[, [300-500[, [500-800[, <800
      }
      const info = data.reduce((p,c)=>{
        const k = `${c['district_in']}`
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
                groupby:['district_in']
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
            },
            "encoding": {
              "shape": {
                "field": "geo",
                "type": "geojson",
              },
              "color": {
                "field": `${topic}`,
                // type:"ordinal"
                "type": "quantitative",
                scale:{
                  // domain:colorDomain[topic],
                  range:['#c3ddf4','#6fa7db','#0e4d8b']
                }
              },
              tooltip:[
                {field:'label',title:'District'},
                {field:topic,title:`${topic.toUpperCase()}`},
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
                  oneOf:district
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
export default useDrawMapDensityAndSubscribers;