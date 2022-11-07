import {  Alert, Breadcrumbs, Button, CircularProgress, Container, Divider, FormControl, Backdrop, Grid, Input, InputLabel, MenuItem, Select, Snackbar, Typography, Chip, Drawer, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import useDrawMapAndGraphByDistrictVegaLite from '@/src/hooks/useDrawMapAndGraphByDistrictVegaLite';
import { ArrowForward, HighlightOff, NavigateNext } from '@mui/icons-material';
import moment from 'moment'
import { Data } from '@/src/types/Data';
import { DataGrid, GridValueGetterParams } from '@mui/x-data-grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export default function Home() {
  const algoritms = {
    movement:{name:'Mobility (Travels)',description:"Density: Number of users who spent most of their time in a certain area in a given time interval. "},
    2:{name:'Density',description:"Density: Number of users who spent most of their time in a certain area in a given time interval. "},
    3:{name:'Subscribers',description:"Density: Number of users who spent most of their time in a certain area in a given time interval. "},
    4:{name:'Residents',description:"Density: Number of users who spent most of their time in a certain area in a given time interval. "},
    5:{name:'Events',description:"Density: Number of users who spent most of their time in a certain area in a given time interval. "},
  }
  const locations = {
    1:'District',
    2:'National',
  }
  const columns = [
    {field:'date_from',headerName:'date_from',width:110,
        valueGetter: (params: GridValueGetterParams) => `${moment(params.row.date_from).format('ll')}`
    },
    {field:'date_to',headerName:'date_to',width:110,
        valueGetter: (params: GridValueGetterParams) => `${moment(params.row.date_to).format('ll')}`
    },
    {field:'district_out',headerName:'district_out',width:100},
    {field:'district_in',headerName:'district_in',width:100},
    {field:'subscriber_in',headerName:'subscriber_in',width:100},
    {field:'subscriber_out',headerName:'subscriber_out',width:110},
    {field:'density_in',headerName:'density_in',width:100},
    {field:'density_out',headerName:'density_out',width:100},
    {field:'sms_in',headerName:'sms_in',width:100},
    {field:'sms_out',headerName:'sms_out',width:100},
    {field:'call_in',headerName:'call_in',width:100},
    {field:'call_out',headerName:'call_out',width:100},
    {field:'movement',headerName:'movement',width:100},
]
  const dateFormat = 'YYYY-MM-DD'
  const [error,setError] = useState('')

  const [dimensions,setDimensions] = useState<{width:number,height:number}>()

  useEffect(()=>{
    setDimensions({
        width:window.innerWidth/2,
        height:Math.ceil(window.innerHeight/(2))

        // height:Math.ceil(window.innerHeight/(3/2))
    })
  },[])

  const [algorithm,setAlgoritm] = useState<number|string>('movement')

  const districts = [
    'Male','Maafushi','Naifaru','Baros','Fuvahmulah'
]
  const [district,setDistrict] = useState<string[]>([])
  const [location,setLocation] = useState<number|string>(1)
  const [from,setFrom] = useState('')
  const [to,setTo] = useState('')
  const [data,setData] = useState<Data[]>([])
  const [loading,setLoading] = useState(false)
  const {Map} = useDrawMapAndGraphByDistrictVegaLite(district,data)

  const [drawerShow,setDrawerShow] = useState(true) 

  const onChangeLocation = (e)=>{
    const val = e.target.value;
    setLocation(val)
    if(val==1)
        setDistrict(()=>[])
    else if(val==2)
        setDistrict(()=>[...districts])
    setData(()=>[])    

  }

  const onChangeDistrict = (e)=>{
    setDistrict(e.target.value)
    setData(()=>[])    
  }

  const validDates = (from,to)=>{
    if(from && to)
        return moment(from).isSameOrBefore(moment(to))
    return true
  }
  const isValidForm = ()=>{
    return algorithm && location && district && district.length && validDates(from,to)
  }

  const setDate = (name,e)=>{
    const val = e.target.value

    if(name=='from'){
        if(!validDates(val,to)){
            setError(`Invalid 'From' value: ${val}`)
        }
        else{
            setFrom(()=>moment(val).format(dateFormat));
        }
    }
    else if(name=='to'){
        if(!validDates(from,val)){
            setError(`Invalid 'To' value: ${val}`)
        }
        else{
            setTo(()=>moment(val).format(dateFormat));
        }
    }
    

  }

  const reset = ()=>{
    setAlgoritm(1)
    setLocation(1)
    setDistrict([])
    setFrom('')
    setTo('')
    setData([])
  }

  const submit =  (e)=>{
    e.preventDefault()
    setLoading(true)
    const dq = district.reduce((p,c)=>{
        p = p ? p+=`&district=${c}` : `district=${c}`;
        return p;
    },'')
    const url = `/api/data?${dq}&from=${from}&to=${to}`;
    fetch(url).then(r=>r.json())
    .then(({data:d})=>{
        setData(d)   
        console.log(dq,d) 
        setLoading(false)
        setDrawerShow(s=>!s)
    })
    // const {data:d} = await r.json()
  }

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerShow(s=>!s);
    };

  

    // {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
    //     <Box key={anchor}>
    //       <Button onClick={toggleDrawer}>{anchor}</Button>
    //       <Drawer
    //         anchor={'left'}
    //         open={drawerShow}
    //        onClose={()=>setDrawerShow(false)}
    //       >
    //        <>
    //        geo 123
    //        </> 
    //       </Drawer>
    //     </Box>
    //   ))}

    const renderAlgoritmMenuItems = ()=>{
        return Object.entries(algoritms).map(([k,v])=>{
            return <MenuItem key={k} value={k}>{v.name}</MenuItem>
            // <MenuItem value={1}>Mobility (Travels)</MenuItem>
            // <MenuItem value={2}>Density</MenuItem>
            // <MenuItem value={3}>Subscribers</MenuItem>
            // <MenuItem value={4}>Residents</MenuItem>
            // <MenuItem value={5}>Events</MenuItem>
        })
    }

    return <Box>
        <style jsx global>
            {`
                .state{
                    transition: fill .8s;
                }
            `}
        </style>
                {/* <Grid container marginTop={0} spacing={2}> */}
                    {/* <Grid item xs={12} md={4} sx={{backgroundColor:'#F4F4F4'}}> */}
                    <Box>
                            <IconButton color="primary" edge="end" onClick={toggleDrawer}> 
                                <MenuIcon />
                                <Typography color='primary' fontWeight={'bold'} textTransform={'uppercase'} variant='h6'>ASK A QUESTION</Typography>
                            </IconButton>

                    </Box>

                <Drawer anchor={'left'} open={drawerShow} onClose={()=>setDrawerShow(false)}>
                    
                    <Box padding={4}>
                        
                    <Box >
                    <IconButton color="primary" edge="end" onClick={toggleDrawer}> 
                        <ChevronLeftIcon />
                        <Typography color='primary' fontWeight={'bold'} textTransform={'uppercase'} variant='h6'>ASK A QUESTION</Typography>
                    </IconButton>
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
                                    {renderAlgoritmMenuItems()}
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
                                {Object.entries(locations).map(([k,v,])=><MenuItem value={k} key={k}>{v}</MenuItem>)}
                                    {/* <MenuItem value={1}>Neighborhood</MenuItem> */}
                                    {/* <MenuItem value={1}>District</MenuItem> */}
                                    {/* <MenuItem value={3}>Island</MenuItem> */}
                                    {/* <MenuItem value={2}>National</MenuItem> */}
                                </Select>
                            </FormControl>
                        </Box>
                        {location==1 ?<Box marginTop={'.5em'}>
                            <Typography variant='body2' fontWeight={'bold'} marginBottom='1em'>District*</Typography>
                            <FormControl fullWidth>
                            <InputLabel id="disctrict-lbl">District</InputLabel>
                            <Select
                            labelId="disctrict-lbl"
                            id="disctrict-select"
                            value={district}
                            label="District"
                            multiple
                            onChange={onChangeDistrict}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                    ))}
                                </Box>
                                )}
                            >
                            {districts.map(d=><MenuItem key={d} value={d}>
                                {d}
                            </MenuItem>)}
                            </Select>
                        </FormControl>
                        </Box>:<></>}
                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant='body2' fontWeight={'bold'} margin={'.5em 0 0'}>From*</Typography>
                                    <Typography variant='caption' color='default' margin={'0'}>Select the start date</Typography>

                                    <FormControl fullWidth>
                                        <Input value={from} onChange={(e)=>setDate('from',e)} type="date"/>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant='body2' fontWeight={'bold'} margin={'.5em 0 0'}>To*</Typography>
                                    <Typography variant='caption' color='default' margin={'0'}>Select the end date</Typography>

                                        <FormControl fullWidth>
                                            <Input value={to} onChange={(e)=>setDate('to',e)} type="date"/>
                                        </FormControl>
                                </Grid>

                            </Grid>
                        </Box>
                        <Box justifyContent={'center'} display='flex' sx={{margin:'.5em 0'}}>
                            <Button variant='contained' disabled={!isValidForm() || loading} sx={{textTransform:'none',width:'126px',borderRadius:'2em'}} color='primary' endIcon={<ArrowForward/>} onClick={submit}>Submit</Button>
                        </Box>
                        <Box justifyContent={'center'} display='flex' sx={{margin:'.5em 0'}}>
                            <Button variant='contained' sx={{textTransform:'none',width:'126px',borderRadius:'2em',backgroundColor:'gray'}} endIcon={<HighlightOff/>} onClick={()=>reset()}>Re-start</Button>
                        </Box>
                    </Box>
                </Drawer>
                
                    {/* </Grid> */}
                    {/* <Grid item xs={12} md={8} > */}
                <Box sx={{padding:'.8em'}}>
                    <Typography color='primary' fontWeight={'bold'} textTransform={'uppercase'} variant='h6' >
                        SAFE ANSWER
                    </Typography>
                    <Box>
                    <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext/>}>
                        <Typography fontWeight={'bold'}>Dataland</Typography>
                        <Typography fontWeight={'bold'}>{algoritms[algorithm].name}</Typography>
                        <Typography fontWeight={'bold'}>{locations[location]}</Typography>
                        {
                            (from||to)
                            ? <Typography fontWeight={'bold'}>
                                {from ? moment(from).format('LL'):''}
                                {to ? ' - '+moment(to).format('LL'):''}
                            </Typography>
                            : ''
                        }
                    </Breadcrumbs>
                    </Box>
                    <Typography fontStyle={'italic'}>{algoritms[algorithm].name}: {algoritms[algorithm].description}</Typography>
                    <Divider sx={{margin:'.5em 0'}} />
                        <Box>
                            <Map></Map>
                        </Box>
                    
                    {/* <Grid container>
                        <Grid item xs={12} md={4}>
                            <Map></Map>
                        </Grid>
                        <Grid item xs={12} md={8}>
                    
                            {dimensions && data && data.length ?<div style={{ height: dimensions.height, width: '100%' }}>
                                <DataGrid
                                    getRowId={(r)=>`${r.date_from}-${r.date_to}-${r.district_in}-${r.district_out}`}
                                    autoPageSize 
                                    pagination 
                                    rows={data}
                                    columns={columns}
                                    checkboxSelection
                                />
                            </div>: <></> }
                        </Grid>
                    </Grid> */}
                </Box>
                
                    {/* </Grid> */}
                {/* </Grid> */}

                <Snackbar 
                    open={!!error} 
                    autoHideDuration={6000} 
                    anchorOrigin={{ vertical:'top', horizontal:'center' }} 
                    onClose={()=>setError('')}
                >
                <Alert severity="warning"><>{error}</></Alert>
                </Snackbar>

                <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

    </Box>

}

