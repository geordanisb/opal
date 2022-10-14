import { Button, FormControl, FormGroup, Grid, Input, InputLabel, MenuItem, Select, Table, TableBody, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Box } from '@mui/system';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
// import * as vegaEmbeded from 'vega-embed'

const v = [
  {"a": "C", "b": 2},
  {"a": "C", "b": 7},
  {"a": "C", "b": 4},
  {"a": "D", "b": 1},
  {"a": "D", "b": 2},
  {"a": "D", "b": 6},
  {"a": "E", "b": 8},
  {"a": "E", "b": 4},
  {"a": "E", "b": 7}
];

export default function Home() {
  const [obj,setObj] = useState({a:'',b:''})
  const [values,setValues] = useState(v)

  const [mark,setMark] = useState('point')
  const [spec,setSpec] = useState()
  const [spec2,setSpec2] = useState({
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "data": {"url": "https://vega.github.io/editor/data/movies.json"},
    "transform": [{
      "filter": {"and": [
        {"field": "IMDB Rating", "valid": true},
        {"field": "Rotten Tomatoes Rating", "valid": true}
      ]}
    }],
    "mark": "rect",
    "width": 300,
    "height": 200,
    "encoding": {
      "x": {
        "bin": {"maxbins":60},
        "field": "IMDB Rating",
        "type": "quantitative"
      },
      "y": {
        "bin": {"maxbins": 40},
        "field": "Rotten Tomatoes Rating",
        "type": "quantitative"
      },
      "color": {
        "aggregate": "count",
        "type": "quantitative"
      }
    },
    "config": {
      "view": {
        "stroke": "transparent"
      }
    }
  })
  const [spec3,setSpec3] = useState({
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 800,
    "height": 500,
    "layer": [
      {
        "data": {
          "url": "https://vega.github.io/editor/data/us-10m.json",
          "format": {
            "type": "topojson",
            "feature": "states"
          }
        },
        "projection": {
          "type": "albersUsa"
        },
        "mark": {
          "type": "geoshape",
          "fill": "lightgray",
          "stroke": "white"
        }
      },
      {
        "data": {
          "url": "https://vega.github.io/editor/data/airports.csv"
        },
        "projection": {
          "type": "albersUsa"
        },
        "mark": "circle",
        "encoding": {
          "longitude": {
            "field": "longitude",
            "type": "quantitative"
          },
          "latitude": {
            "field": "latitude",
            "type": "quantitative"
          },
          "size": {"value": 5},
          "color": {"value": "gray"}
        }
      },
      {
        "data": {
          "url": "https://vega.github.io/editor/data/flights-airport.csv"
        },
        "transform": [
          {"filter": {"field": "origin", "equal": "SEA"}},
          {
            "lookup": "origin",
            "from": {
              "data": {
                "url": "https://vega.github.io/editor/data/airports.csv"
              },
              "key": "iata",
              "fields": ["latitude", "longitude"]
            },
            "as": ["origin_latitude", "origin_longitude"]
          },
          {
            "lookup": "destination",
            "from": {
              "data": {
                "url": "https://vega.github.io/editor/data/airports.csv"
              },
              "key": "iata",
              "fields": ["latitude", "longitude"]
            },
            "as": ["dest_latitude", "dest_longitude"]
          }
        ],
        "projection": {
          "type": "albersUsa"
        },
        "mark": "rule",
        "encoding": {
          "longitude": {
            "field": "origin_longitude",
            "type": "quantitative"
          },
          "latitude": {
            "field": "origin_latitude",
            "type": "quantitative"
          },
          "longitude2": {"field": "dest_longitude"},
          "latitude2": {"field": "dest_latitude"}
        }
      }
    ]
  }
  )
  useEffect(()=>{
    setSpec({
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "data":{
        values:[...values]
      },
      mark,
      "encoding": {
        "x":{"field":"a","type":"ordinal"},
        "y":{"field":"b","type": "quantitative"}
      }
    })
  },[mark,values])
  useEffect(()=>{
    vegaEmbed('#vis',spec);
    vegaEmbed('#vis2',spec2);
    vegaEmbed('#vis3',spec3);
  })
  const handleChangeMark = (e)=>{
    setMark(e.target.value)
  }
  const add = ()=>{
    setSpec({
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "data":{
        values:[...values]
      },
      mark,
      "encoding": {
        "x":{"field":"a","type":"ordinal"},
        "y":{"field":"b","type": "quantitative"}
      }
    })
    setValues(r=>{
      debugger;
      return [...r,{...obj}]
    })
  }
  const smartGrid = ()=>{
    return <>
    <FormGroup sx={{border:"solid 1px green; border-radius:.5em;padding:1em;margin:1em 0;"}}>
      <Box sx={{marginTop:'1em'}}>
        <FormControl fullWidth>
            <InputLabel id="select-mark">Select a</InputLabel>
            <Select
              labelId="select-mark"
              id="demo-simple-select"
              value={obj.a}
              label="A"
              onChange={(e)=>setObj(r=>({...r,a:e.target.value}))}
            >
              <MenuItem value={'C'}>C</MenuItem>
              <MenuItem value={'D'}>D</MenuItem>
              <MenuItem value={'E'}>E</MenuItem>
              <MenuItem value={'F'}>F</MenuItem>

            </Select>
          </FormControl>
      </Box>
      <Box sx={{marginTop:'1em'}}>
        <FormControl>
          <InputLabel id="i-b">Enter b</InputLabel>
          <Input labelId='i-b' type='number' value={obj.b} onChange={(e)=>setObj(r=>({...r,b:e.target.value}))}/>
        </FormControl>
      </Box>
      <Button variant='contained' size="small" onClick={add}>Add</Button>
    </FormGroup>
      {/* <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </>
  }
  return <>
    {/* <Box  sx={{
      padding:'2em',
    }}>
      <Grid container>
        <Grid xs={6}>
          <h2>Bar Charts</h2>
          <div id="vis"></div>
        </Grid>
        <Grid xs={6}>
          <h2>Select Mark</h2>
          <FormControl fullWidth>
            <InputLabel id="select-mark">Mark</InputLabel>
            <Select
              labelId="select-mark"
              id="demo-simple-select"
              value={mark}
              label="Mark"
              onChange={handleChangeMark}
            >
              <MenuItem value={'bar'}>BAR</MenuItem>
              <MenuItem value={'point'}>POINT</MenuItem>
            </Select>
          </FormControl>
          {smartGrid()}
        </Grid>
      </Grid>
      <Grid container>
        <Grid>
          <h2>2D Histogram Heatmap</h2>
          <div id='vis2'></div>
        </Grid>
        <Grid>
          <h2></h2>
          <div id="vis3"></div>
        </Grid>
      </Grid>
    </Box> */}
  </>
}
