import { NavigateNext } from '@mui/icons-material'
import { Box, Breadcrumbs, Button, Container, Divider, FormControl, Grid, Input, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import React,{ FunctionComponent, useEffect, useState } from 'react'

const DatalandPage: FunctionComponent = ()=>{
    const algoritmMap = {
        1:{name:'Mobility (Travels)',description:"Density: Number of users who spent most of their time in a certain area in a given time interval. "},
        2:{name:'Density',description:"Density: Number of users who spent most of their time in a certain area in a given time interval. "},
        3:{name:'Subscribers',description:"Density: Number of users who spent most of their time in a certain area in a given time interval. "},
        4:{name:'Residents',description:"Density: Number of users who spent most of their time in a certain area in a given time interval. "},
        5:{name:'Events',description:"Density: Number of users who spent most of their time in a certain area in a given time interval. "},
    }
    const locationMap = {
        1:'Neighborhood',
        2:'District',
        3:'Island',
        4:'National',
    }
    const [algorithm,setAlgoritm] = useState<number|string>(1)
    const [location,setLocation] = useState<number|string>(1)
    const [from,setFrom] = useState<Date>()
    const [to,setTo] = useState<Date>()
    const [spec,setSpec] = useState<Record<string,any>>()

    useEffect(()=>{
        setSpec({
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "width": window.innerWidth/3,
            "height": window.innerHeight/2,
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
          })
    },[])
    useEffect(()=>{
        if(spec && 'vegaEmbed' in window){
            const vegaEmbed = (window as typeof window & {vegaEmbed:any}).vegaEmbed
            vegaEmbed('#vis',spec);
        }
      },[spec])


    return <Container>
                <Grid container spacing={2}sx={{paddingBottom:'6em'}} >
                    <Grid item xs={12} md={4} >
                        <Box >
                            <Typography color='skyblue' fontWeight={'bold'} textTransform={'uppercase'} variant='h6' sx={{margin:'.5em 0 0'}}>ASK A QUESTION</Typography>
                            <Typography component='p'>To do so, select a topic of interest, and set of parameters (location and timeframe).</Typography>
                            <p></p>
                        </Box>
                        <Box marginTop={'.5em'}>
                            <Typography variant='body2' fontWeight={'bold'} marginBottom='1em'>Topic*</Typography>
                            <FormControl fullWidth>
                                <InputLabel id="select-mark">Select the algorithm you want to explore.</InputLabel>
                                <Select
                                labelId="select-mark"
                                id="demo-simple-select"
                                value={algorithm}
                                label="Select the algorithm you want to explore."
                                onChange={(e)=>setAlgoritm(e.target.value)}
                                >
                                    <MenuItem value={1}>Mobility (Travels)</MenuItem>
                                    <MenuItem value={2}>Density</MenuItem>
                                    <MenuItem value={3}>Subscribers</MenuItem>
                                    <MenuItem value={4}>Residents</MenuItem>
                                    <MenuItem value={5}>Events</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box marginTop={'.5em'}>
                            <Typography variant='body2' fontWeight={'bold'} marginBottom='1em'>Location*</Typography>
                            <FormControl fullWidth>
                                <InputLabel id="select-mark">Select the geographical granularity.</InputLabel>
                                <Select
                                labelId="select-mark"
                                id="demo-simple-select"
                                value={location}
                                label="Select the algorithm you want to explore."
                                onChange={(e)=>setLocation(e.target.value)}
                                >
                                    <MenuItem value={1}>Neighborhood</MenuItem>
                                    <MenuItem value={2}>District</MenuItem>
                                    <MenuItem value={3}>Island</MenuItem>
                                    <MenuItem value={4}>National</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant='body2' fontWeight={'bold'} margin={'.5em 0 0'}>From*</Typography>
                                    <Typography variant='caption' color='default' margin={'0'}>Select the start date</Typography>

                                    <FormControl fullWidth>
                                        <Input value={from} onChange={(e)=>setFrom(new Date(e.target.value))} type="date"/>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant='body2' fontWeight={'bold'} margin={'.5em 0 0'}>To*</Typography>
                                    <Typography variant='caption' color='default' margin={'0'}>Select the end date</Typography>

                                        <FormControl fullWidth>
                                            <Input value={to} onChange={(e)=>setTo(new Date(e.target.value))} type="date"/>
                                        </FormControl>
                                </Grid>

                            </Grid>
                        </Box>
                        <Box justifyContent={'center'} display='flex' sx={{margin:'.5em 0'}}>
                            <Button variant='contained' color='primary'>Submit</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8} >
                        <Box >
                            <Typography color='skyblue' fontWeight={'bold'} textTransform={'uppercase'} variant='h6' sx={{margin:'.5em 0 0'}}>
                                SAFE ANSWER
                            </Typography>
                            <Box>
                            <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext/>}>
                                <Typography fontWeight={'bold'}>Dataland</Typography>
                                <Typography fontWeight={'bold'}>{algoritmMap[algorithm].name}</Typography>
                                <Typography fontWeight={'bold'}>{locationMap[location]}</Typography>
                                {(from||to) 
                                    ? <Typography fontWeight={'bold'}>
                                        {from ? from.toLocaleString('en-en',{day:'numeric',month:'long',year:'numeric'}):''}
                                        {to ? ' - '+to.toLocaleString('en-en',{day:'numeric',month:'long',year:'numeric'}):''}
                                    </Typography>
                                :''}
                            </Breadcrumbs>
                            </Box>
                            <Typography fontStyle={'italic'}>{algoritmMap[algorithm].name}: {algoritmMap[algorithm].description}</Typography>
                            <Divider sx={{margin:'.5em 0'}} />
                            <Box>
                                <div id="vis"></div>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

    </Container> 
}
export default DatalandPage
