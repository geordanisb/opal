import {  Breadcrumbs, Button, Container, Divider, FormControl, FormGroup, Grid, Input, InputLabel, MenuItem, Select, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import useDrawDistrict from '@/src/hooks/useDrawDistrict';
import { ArrowForward, HighlightOff, NavigateNext } from '@mui/icons-material';
// import * as vegaEmbeded from 'vega-embed'

export default function Home() {
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

  const [district,setDistrict] = useState('')
  const [location,setLocation] = useState<number|string>(2)
  const [from,setFrom] = useState<Date>()
  const [to,setTo] = useState<Date>()

  const {Map} = useDrawDistrict(district)

  const onChangeLocation = (e)=>{
    const val = e.target.value;
    setLocation(val)
    if(val==2)setDistrict('')
  }

    return <Box>
        <style jsx global>
            {`
                .state{
                    transition: fill .8s;
                }
            `}
        </style>
                <Grid container marginTop={0} spacing={2}>
                    <Grid item xs={12} md={4} sx={{backgroundColor:'#F4F4F4'}}>
                      <Box padding={4}>
                        <Box >
                              <Typography color='primary' fontWeight={'bold'} textTransform={'uppercase'} variant='h6' sx={{margin:'.5em 0 0'}}>ASK A QUESTION</Typography>
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
                                  onChange={onChangeLocation}
                                  >
                                      <MenuItem value={1}>Neighborhood</MenuItem>
                                      <MenuItem value={2}>District</MenuItem>
                                      <MenuItem value={3}>Island</MenuItem>
                                      <MenuItem value={4}>National</MenuItem>
                                  </Select>
                              </FormControl>
                          </Box>
                          {location==2 ?<Box marginTop={'.5em'}>
                              <Typography variant='body2' fontWeight={'bold'} marginBottom='1em'>District*</Typography>
                              <FormControl fullWidth>
                              <InputLabel id="disctrict-lbl">District</InputLabel>
                              <Select
                                labelId="disctrict-lbl"
                                id="disctrict-select"
                                value={district}
                                label="District"
                                onChange={(e)=>setDistrict(e.target.value)}
                              >
                                <MenuItem value='male'>Malé</MenuItem>
                                <MenuItem value='fuvahmulah'>Fuvahmulah</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>:<></>}
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
                              <Button variant='contained' sx={{textTransform:'none',width:'126px',borderRadius:'2em'}} color='primary' endIcon={<ArrowForward/>}>Submit</Button>
                          </Box>
                          <Box justifyContent={'center'} display='flex' sx={{margin:'.5em 0'}}>
                              <Button variant='contained' sx={{textTransform:'none',width:'126px',borderRadius:'2em',backgroundColor:'gray'}} endIcon={<HighlightOff/>}>Re-start</Button>
                          </Box>
                      </Box>
                        
                    </Grid>
                    <Grid item xs={12} md={8} >
                        <Box >
                            <Typography color='primary' fontWeight={'bold'} textTransform={'uppercase'} variant='h6' sx={{margin:'.5em 0 0'}}>
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
                                {/* <Typography fontWeight={'bold'}>
                                USA Seatle's airport flys to other airports
                                </Typography>
                                <Typography fontStyle={'italic'} color='primary' className='info-panel'>

                                </Typography>
                                <div id="vis"></div> */}
                                <Map></Map>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

    </Box> 
  
}

