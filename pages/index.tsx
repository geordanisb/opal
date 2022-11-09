import {  Alert, Breadcrumbs, Button, CircularProgress, Container, Divider, FormControl, Backdrop, Grid, Input, InputLabel, MenuItem, Select, Snackbar, Typography, Chip, Drawer, IconButton, FormLabel, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import { CalendarPicker, MonthPicker, YearPicker } from '@mui/x-date-pickers';
import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useEffect, useState } from 'react';
import useDrawMapAndGraphByDistrictVegaLite from '@/src/hooks/useDrawMapAndGraphByDistrictVegaLite';
import { ArrowForward, HighlightOff, NavigateNext } from '@mui/icons-material';
import moment, { Moment } from 'moment'
import { DataMonthly, DataWeekly, DataYearly } from '@/src/types/Data';
import { DataGrid, GridValueGetterParams } from '@mui/x-data-grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import csv from 'csvtojson'
import path from 'node:path'
import { NextPage } from 'next';


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
interface Props{
    data:{
        monthly:DataMonthly[],
        weekly:DataWeekly[],
        yearly:DataYearly[],
    }
    
}

const Home:NextPage<Props> = (props) => {
  const yearsMap = [2020,2021,2022]
  const minWidth = '270px';
  const dateFormat = 'YYYY-MM-DD'
  const minDate = moment('2020-01-01T00:00:00.000');
  const maxDate = moment('2034-01-01T00:00:00.000');

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
  const [periodType,setPeriodType] = useState<string>('weekly')

  const [dateFrom,setDateFrom] = useState<Moment>()
  const [dateTo,setDateTo] = useState<Moment>()

  const [yearFrom,setYearFrom] = useState<Moment>()
  const [years,setYears] = useState<string[]>([])

  const [months,setMonths] = useState<string[]>([])


  const [dataMonthly,setDataMonthly] = useState<DataMonthly[]>(props.data.monthly)
  const [dataWeekly,setDataWeekly] = useState<DataWeekly[]>(props.data.weekly)
  const [dataYearly,setDataYearly] = useState<DataYearly[]>(props.data.yearly)

  const [data,setData] = useState<(DataMonthly|DataWeekly|DataYearly)[]>([])

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

  const onChangeYears = (e)=>{
    setYears(e.target.value)
    setData(()=>[])    
  }

  const onChangeMonths = (e)=>{
    setMonths(e.target.value)
    setData(()=>[])    
  }

  const validDates = ()=>{
    // if(date && to)
    //     return moment(from).isSameOrBefore(moment(to))
    return true
  }
  const isValidForm = ()=>{
    return algorithm && location && district && district.length  && validDates()
  }

//   const onChangeDate = (name,e)=>{
//     const val = e.target.value

//     if(name=='date'){
//         if(!validDates(val,'dateTo')){
//             setError(`Invalid 'From' value: ${val}`)
//         }
//         else{
//             setDate(()=>moment(val));
//         }
//     }
//     else if(name=='dateTo'){
//         if(!validDates(date,val)){
//             setError(`Invalid 'To' value: ${val}`)
//         }
//         else{
//             setDateTo(()=>moment(val));
//         }
//     }
    

//   }

  

  const reset = ()=>{
    setAlgoritm('movement')
    setLocation(1)
    setDistrict([])
    setPeriodType('weekly')
    setData([])
  }

//   const getAPI_Fetch_URL = ()=>{
//     let url = `/api/data?`;
    
//     const dq = district.reduce((p,c)=>{
//         p = p ? p+=`&district=${c}` : `district=${c}`;
//         return p;
//     },'')

//     const yq = years.reduce((p,c)=>{
//         p = p ? p+=`&year=${c}` : `&year=${c}`;
//         return p;
//     },'')

//     if(periodType=='weekly' && dateFrom && dateTo){
//         url += `${dq}&from=${dateFrom?dateFrom.format(dateFormat):''}&to=${dateTo?dateTo.format(dateFormat):''}`
//     }
//     else if(periodType=='monthly' && yearFrom && month){
//         const from = moment(`${yearFrom}-${month}-01`).format(dateFormat)
//         url += `${dq}&month=${from}`
//     }
//     else if(periodType=='yearly' && years && years.length){
//         url += `${dq}${yq}`
//     }
//     return url

//   }

  const submit =  (e)=>{
    e.preventDefault()
    setLoading(true)
    let d=[];
    if(periodType == 'yearly' && years?.length){
        d = props.data.yearly.filter(i=>{
            return years.includes(i.date)
        })
    }
    if(periodType == 'monthly' && months?.length){
        d = props.data.monthly.filter(i=>{
            return months.includes(i.date)
        })
    }
    setData(d)
    console.log(d)
    setLoading(false)
    
    // const url = getAPI_Fetch_URL()
    // fetch(url).then(r=>r.json())
    // .then(({data:d})=>{
    //     setData(d)   
    //     setLoading(false)
    //     setDrawerShow(s=>!s)
    // })

    
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
        })
    }

    const renderYearsMenuItems = ()=>{
        return yearsMap.map(y=><MenuItem key={y} value={`${y}`}>{y}</MenuItem>)
    }

    const renderMonthsMenuItems = ()=>{
        let months = props.data.monthly.map(d=>d.date)
        if(years)
            months = months.filter(i=>years.includes(i.split('-')[0]))
        months =  Array.from(new Set(months))

        return months.map(y=><MenuItem key={y} value={`${y}`}>{y}</MenuItem>)
    }

    const renderBreadcrumbs = ()=>{
        const renderDateBreadcrumb =()=>{
            if(periodType=='weekly')
                return <Typography fontWeight={'bold'}>
                {dateFrom ? moment(dateFrom).format('LL'):''}
                {dateTo ? ' - '+moment(dateTo).format('LL'):''}
            </Typography>
            else if(periodType=='monthly')
                return <Typography fontWeight={'bold'}>
                    {years.join(', ')}
                </Typography>
            else if(periodType=='yearly' && years)
                return <Typography fontWeight={'bold'}>
                    {years.join(', ')}
                </Typography>
        }
        return <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext/>}>
            <Typography fontWeight={'bold'}>Dataland</Typography>
            {algoritms[algorithm]?<Typography fontWeight={'bold'}>{algoritms[algorithm].name}</Typography>:undefined}
            {locations[location]?<Typography fontWeight={'bold'}>{locations[location]}</Typography>:undefined}
            {renderDateBreadcrumb()}
        </Breadcrumbs>
    }

    const renderDateControls = ()=>{
        if(periodType=='weekly'){
            return <Grid container>
                <Grid item xs={12} md={6}>
                    <Box sx={{width:minWidth}}>
                        <Typography variant='body2' fontWeight={'bold'} margin={'.5em 0 0'}>From*</Typography>
                        {/* <Typography variant='caption' color='default' margin={'0'}>Select the start date</Typography> */}
                        <CalendarPicker disableHighlightToday date={dateFrom} onChange={(v) => setDateFrom(v)} />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{width:minWidth}}>
                        <Typography variant='body2' fontWeight={'bold'} margin={'.5em 0 0'}>To*</Typography>
                        {/* <Typography variant='caption' color='default' margin={'0'}>Select the end date</Typography> */}
                        <CalendarPicker disableHighlightToday date={dateTo} onChange={(v) => setDateTo(v)} />
                    </Box>
                </Grid>

            </Grid>
        }
        else if(periodType=='monthly'){
            return <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="select-years">Select the years you want to explore.</InputLabel>
                        <Select
                        labelId="select-years"
                        value={years}
                        label="Select the years you want to explore."
                        multiple
                        onChange={onChangeYears}
                        >
                            {renderYearsMenuItems()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={8}>
                    <FormControl fullWidth>
                        <InputLabel id="select-months">Select the months you want to explore.</InputLabel>
                        <Select
                        labelId="select-months"
                        value={months}
                        label="Select the months you want to explore."
                        multiple
                        onChange={onChangeMonths}
                        >
                            {renderMonthsMenuItems()}
                        </Select>
                    </FormControl>

                </Grid>
            </Grid>
        }
        else if(periodType=='yearly'){
            return <Box>

                            <FormControl fullWidth>
                                <InputLabel id="select-years">Select the years you want to explore.</InputLabel>
                                <Select
                                labelId="select-years"
                                value={years}
                                label="Select the years you want to explore."
                                multiple
                                onChange={onChangeYears}
                                >
                                    {renderYearsMenuItems()}
                                </Select>
                            </FormControl>

{/* 
                <Typography variant='body2' fontWeight={'bold'} margin={'.5em 0 0'}>Years (type a year and press "Enter")*</Typography>
                <TextField variant="standard" type={'number'} onKeyUp={onKeyUpYear}  />
                {years.map((y)=><Chip key={y} label={y}/>)}
                 */}
            </Box>
        }
        return <></>
    }

    const onKeyUpYear = (e)=>{
        if(e.key=='Enter'){
            const v = e.target.value;
            setYears((y)=>[...y,v])
            e.target.value=''
        }
    }

    const onChangePeriodType = (e)=>{
        setPeriodType(e.target.value)
        setData(()=>props.data[e.target.value])
        console.log(e.target.value,props.data[e.target.value])
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
                    <Box padding={{md:4,xs:1}}>
                        <Box>
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
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">
                                <Typography variant='body2' fontWeight={'bold'} color='black' margin='1em 0 .5em 0'>Period type</Typography>
                            </FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={periodType}
                                onChange={onChangePeriodType}
                            >
                                <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
                                <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                                <FormControlLabel value="yearly" control={<Radio />} label="Yearly" />

                            </RadioGroup>
                            </FormControl>
                        </Box>
                        {renderDateControls()}
                        
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
                    {renderBreadcrumbs()}
                    </Box>
                    {algoritms[algorithm]?<Typography fontStyle={'italic'}>{algoritms[algorithm].name}: {algoritms[algorithm].description}</Typography>:undefined}
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
export const getServerSideProps = async ()=>{
    const mp = path.join(process.cwd(),'public','static','data','opal_synthetic','monthly.csv')
    let monthly = await csv().fromFile(mp) 

    const wp = path.join(process.cwd(),'public','static','data','opal_synthetic','weekly.csv')
    let weekly = await csv().fromFile(wp) 

    const yp = path.join(process.cwd(),'public','static','data','opal_synthetic','yearly.csv')
    let yearly = await csv().fromFile(yp) 

    return {
        props:{
            data:{
                monthly,
                weekly,
                yearly
            }
        }
    }
}
export default Home

