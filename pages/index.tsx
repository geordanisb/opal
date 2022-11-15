import {  Alert, Breadcrumbs, Button, CircularProgress, Divider, FormControl, Backdrop, Grid, InputLabel, MenuItem, Select, Snackbar, Typography, Chip, Drawer, IconButton, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';
import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useEffect, useState } from 'react';
import { ArrowForward, HighlightOff, NavigateNext } from '@mui/icons-material';
import moment from 'moment'
import { MonthlyDensitySubscriber, MonthlyMobilityEvent, Topic, WeeklyDensitySubscriber, WeeklyMobilityEvent, YearlyDensitySubscriber, YearlyMobilityEvent } from '@/src/types/Data';
// import { DataGrid, GridValueGetterParams } from '@mui/x-data-grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import csv from 'csvtojson'
import path from 'node:path'
import { NextPage } from 'next';
import { DistrictsMap } from '@/src/constants';
import useDrawMapMovilityAndEvents from '@/src/hooks/useDrawMapMovilityAndEvents';
import useDrawMapDensityAndSubscribers from '@/src/hooks/useDrawMapDensityAndSubscribers';

const topics = {
    movement:{name:'Mobility (Travels)',description:"Average number of antennas visited by subscribers for a specific timeframe, starting from district_one to district_two (the maximum number of cell towers the user could visit is 500)."},
    density:{name:'Density',description:"The number of home-located subscribers (who pin the same antenna for a determined period of time during a day) divided by the km’2 for a given area within a specific timeframe."},
    subscribers:{name:'Subscribers',description:"The active number of SIM cards registered with the mobile network operator (MNO) in a specific district within a period of time."},
    call_out:{name:'Events calls',description:"The total number of calls sent by subscribers located in district_one to subscribers located in district_two (district one and two could be the same)"},
    sms_out:{name:'Events SMSs',description:"The total number of SMSs sent by subscribers located in district_one to subscribers located in district_two (district one and two could be the same)"},

  }
const locations = {
1:'District',
2:'National',
}
// const columns = [
//     {field:'date_from',headerName:'date_from',width:110,
//         valueGetter: (params: GridValueGetterParams) => `${moment(params.row.date_from).format('ll')}`
//     },
//     {field:'date_to',headerName:'date_to',width:110,
//         valueGetter: (params: GridValueGetterParams) => `${moment(params.row.date_to).format('ll')}`
//     },
//     {field:'district_out',headerName:'district_out',width:100},
//     {field:'district_in',headerName:'district_in',width:100},
//     {field:'subscriber_in',headerName:'subscriber_in',width:100},
//     {field:'subscriber_out',headerName:'subscriber_out',width:110},
//     {field:'density_in',headerName:'density_in',width:100},
//     {field:'density_out',headerName:'density_out',width:100},
//     {field:'sms_in',headerName:'sms_in',width:100},
//     {field:'sms_out',headerName:'sms_out',width:100},
//     {field:'call_in',headerName:'call_in',width:100},
//     {field:'call_out',headerName:'call_out',width:100},
//     {field:'movement',headerName:'movement',width:100},
// ]
type DensitySubscriber = MonthlyDensitySubscriber|WeeklyDensitySubscriber|YearlyDensitySubscriber
type MobilityEvent = MonthlyMobilityEvent|WeeklyMobilityEvent|YearlyMobilityEvent
interface Props{
    data:{
        monthly:{
            density_subscribers:MonthlyDensitySubscriber[],
            mobility_events:MonthlyMobilityEvent[]
        },
        weekly:{
            density_subscribers:WeeklyDensitySubscriber[],
            mobility_events:WeeklyMobilityEvent[]
        },
        yearly:{
            density_subscribers:YearlyDensitySubscriber[],
            mobility_events:YearlyMobilityEvent[]
        },
    }
}
const Home:NextPage<Props> = () => {
  const yearsMap = [2020,2021,2022]

  const [error,setError] = useState('')

  const [topic,setTopic] = useState<Topic>('movement')

  const districts = Object.keys(DistrictsMap)
  const [district,setDistrict] = useState<string[]>([])
  const [districtIn,setDistrictIn] = useState<string>('')
  const [districtOut,setDistrictOut] = useState<string>('')

  const [location,setLocation] = useState<number|string>(1)
  const [periodType,setPeriodType] = useState<string>('weekly')

  const [years,setYears] = useState<string>('')

  const [months,setMonths] = useState<string>('')
  const [weekFrom,setWeekFrom] = useState<string>('')
  const [weekTo,setWeekTo] = useState<string>('')

  const fetchData = ()=>{
    const t = isMobilityOrEvent() ? 'mobility_events' : 'density_subscriber'
    const url = `/api/${periodType}?topic=${t}`
    return fetch(url).then(r=>r.json())
  }
    const [data,setData] = useState<Record<string,any>[]>([])

    useEffect(()=>{
        const fn = async ()=>{
            const {data:d} = await fetchData();
            debugger;
            if(d)setData(d)
        }
        if(periodType && topic){
            debugger;
            fn()
        }
    },[periodType,topic])


  const [dataMovilityAndEvents,setDataMovilityAndEvents] = useState<(MobilityEvent)[]>([])
  const [dataDensityAndSubscribers,setDataDensityAndSubscribers] = useState<(DensitySubscriber)[]>([])

  const [loading,setLoading] = useState(false)

  const [doRenderMovilityAndEvents,setDoRenderMovilityAndEvents] = useState(false)
  const [doRenderDensityAndSubscribers,setDoRenderDensityAndSubscribers] = useState(false)

//   const [excludeOutEqIN,setExcludeOutEqIN] = useState(false)
  const {Map:MapMovilityAndEvents} = useDrawMapMovilityAndEvents(districtIn,districtOut,topic,data,doRenderMovilityAndEvents)
  const {Map:MapDensityAndSubscribers} = useDrawMapDensityAndSubscribers(district,topic,data,doRenderDensityAndSubscribers)

  

  const [drawerShow,setDrawerShow] = useState(true) 

  const onChangeAlgoritm = (e)=>{
    const v = e.target.value
    setTopic(v)

    setLocation(1)
    setDistrict([])
    setPeriodType('weekly')
    setYears('')
    setMonths('')
    setWeekFrom('')
    setWeekTo('')

    setDataMovilityAndEvents([]) 
    setDataDensityAndSubscribers([]) 

  }

  const onChangeLocation = (e)=>{
    const val = e.target.value;
    setLocation(val)
    if(val==1){
        setDistrictOut('')
        setDistrictIn('')
        setDistrict(()=>[])
    }
    else if(val==2){
        setDistrictOut('')
        setDistrictIn('')   
        setDistrict(()=>[...districts])
    }
    setDataDensityAndSubscribers([]) 
    setDataMovilityAndEvents(()=>[])    

  }

  const onChangeDistrict = (e)=>{
    setDistrict(e.target.value)
    setDistrictIn('')
    setDistrictOut('')
    setDataDensityAndSubscribers([]) 
    setDataMovilityAndEvents(()=>[])    
  }

  const onChangeDistrictIn = (e)=>{
    setDistrictIn(e.target.value)
    setDistrict([])
    setDataDensityAndSubscribers([]) 
    setDataMovilityAndEvents([])    
  }

  const onChangeDistrictOut = (e)=>{
    setDistrictOut(e.target.value)
    setDistrict([])
    setDistrictIn('')
    setDataDensityAndSubscribers([]) 
    setDataMovilityAndEvents([])    
  }

  const onChangeYears = (e)=>{
    setYears(e.target.value)
    setMonths('')
    setDataDensityAndSubscribers([]) 
    setDataMovilityAndEvents(()=>[])    
  }

  const onChangeMonths = (e)=>{
    setMonths(e.target.value)
    setWeekFrom('')
    setWeekTo('')

    setDataDensityAndSubscribers([]) 
    setDataMovilityAndEvents(()=>[])    
  }

  const onChangeWeekFrom = (e)=>{
    setWeekFrom(e.target.value)
    setDataDensityAndSubscribers([]) 
    setDataMovilityAndEvents(()=>[])    
  }

  const onChangeWeekTo = (e)=>{
    setWeekTo(e.target.value)
    setDataDensityAndSubscribers([]) 
    setDataMovilityAndEvents(()=>[])    
  }

  const validDates = ()=>{
    if(periodType=='weekly')
        return weekFrom && weekTo
    else if(periodType=='monthly')
        return years && months
    else if(periodType=='yearly')
        return years   
    return true
  }
  const isValidForm = ()=>{
    return topic && location && (district&&district.length || districtIn&&districtOut)  && validDates() && data && data.length
  }

  const reset = ()=>{
    setTopic('movement')
    setLocation(1)
    setDistrict([])
    setPeriodType('weekly')
    setYears('')
    setMonths('')
    setWeekFrom('')
    setWeekTo('')
    setDataDensityAndSubscribers([]) 
    setDataMovilityAndEvents([])
  }

  const isMobilityOrEvent = ()=>['movement','call_out','sms_out'].includes(topic) 


  const submit =  async (e)=>{debugger;
    e.preventDefault()
    setLoading(true)
    let d = data

    if(periodType == 'weekly' && weekFrom&&weekTo){
        const date_from = moment(weekFrom.split('-')[0],'DD-MM-YYYY')
        const date_to = moment(weekTo.split('-')[1],'DD-MM-YYYY')

        d = d.filter(i=>{
            const df = moment(i.date_from,'DD-MM-YYYY')
            const dt = moment(i.date_to,'DD-MM-YYYY')
            const q1 = df.isBetween(date_from,date_to,undefined,'[]')
            const q2 = dt.isBetween(date_from,date_to,undefined,'[]')
            return q1 && q2
        })
         
    }
    else if(periodType == 'monthly' && months){
        d = d.filter(i=>{
            return months == i.date
        })
    }
    else if(periodType == 'yearly' && years){
        d = d.filter(i=>{
            return years == i.date
        })
    }
    
    if(districtOut && districtIn && isMobilityOrEvent()){
        const o = d.filter(i=>(i.district_out == districtOut && i.district_in == districtIn))
        // const i = d.filter(i=>(i.district_in == districtOut && i.district_out == districtIn))
        d = [
            ...o,
            // ...i
        ]
    }
    else    
        d = d.filter(i=>district.includes(i.district_in))
    
    if(isMobilityOrEvent()){
        // setDataMovilityAndEvents(d)
        setDoRenderMovilityAndEvents(true)
        setDoRenderDensityAndSubscribers(false)

    }
    else{
        // setDataDensityAndSubscribers(d)
        setDoRenderMovilityAndEvents(false)
        setDoRenderDensityAndSubscribers(true)
    }
    setLoading(false)
    data && data.length ? setDrawerShow(false):setDrawerShow(true)
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

    const renderAlgoritmMenuItems = ()=>{
        return Object.entries(topics).map(([k,v])=>{
            return <MenuItem key={k} value={k}>{v.name}</MenuItem>
        })
    }

    const renderYearsMenuItems = ()=>{
        return yearsMap.map(y=><MenuItem key={y} value={`${y}`}>{y}</MenuItem>)
    }

    const renderMonthsMenuItems = ()=>{
        if(data && data.length){
            let months = data.map(d=>d.date)
            
            if(years)
                months = months.filter(i=>years.includes(i.split('-')[0]))
            months =  Array.from(new Set(months))
    
            return months.map(y=><MenuItem key={y} value={`${y}`}>{y}</MenuItem>)

        }
        return []
    }

    const renderWeeksMenuItems =  (validateTo=false)=>{
        if(data && data.length){
            let weeks = data.reduce((p,c)=>{
                const k = `${c.date_from}-${c.date_to}`
                if(weekFrom && validateTo){
                    const cy = moment(c.date_from,'DD-MM-YYYY')
                    const [date_from,date_to] = weekFrom.split('-')
                    if(moment(c.date_to,'DD-MM-YYYY').isAfter(moment(date_to,'DD-MM-YYYY')))
                        p.push(k)
    
                    return p;
                }
                else{
                    p.push(k)
                    return p;
                }
            },[])
    
            if(periodType=='weekly'){
                weeks =  Array.from(new Set(weeks as Record<string,any>[]))
                return weeks.map(y=><MenuItem key={y} value={`${y}`}>{y}</MenuItem>)
            }

        }
        return []
    }

    const renderBreadcrumbs = ()=>{
        const renderDateBreadcrumb =()=>{
            if(periodType=='weekly' && weekFrom && weekTo){
                const df = weekFrom.split('-')[0]
                const dt = weekTo.split('-')[1]
                return <Typography fontWeight={'bold'}>
                    {[df,dt].join('-')}
                </Typography>
            }
            else if(periodType=='monthly' && months){
                return <Typography fontWeight={'bold'}>
                    {months}
                </Typography>
            }
            else if(periodType=='yearly' && years)
                return <Typography fontWeight={'bold'}>
                    {years}
                </Typography>
        }
        const renderDistricts = ()=>{
            if(location==2)return <></>
            if(districtIn && districtOut)
                return <>
                    (<span>{`${DistrictsMap[districtOut].label} -> ${DistrictsMap[districtIn].label}`}</span>)
                </>
        }
        return <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext/>}>
            <Typography fontWeight={'bold'}>Dataland</Typography>
            {topics[topic]?<Typography fontWeight={'bold'}>{topics[topic].name}</Typography>:undefined}
            {locations[location]?<Typography fontWeight={'bold'}>{locations[location]} {renderDistricts()}</Typography>:undefined}
            
            {renderDateBreadcrumb()}
        </Breadcrumbs>
    }

    const renderDistrictControls = ()=>{
        
        if(location == 1){
            const boths = isMobilityOrEvent()
            const din = <Box marginTop={'.5em'}>
            <Typography variant='body2' fontWeight={'bold'} marginBottom='1em'>District In*</Typography>
            <FormControl fullWidth>
            <InputLabel id="disctrict-in-lbl">District</InputLabel>
            <Select
            labelId="disctrict-in-lbl"
            id="disctrict-in"
            value={districtIn}
            label="District"
            onChange={onChangeDistrictIn}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label={DistrictsMap[selected].label} />
                </Box>
                )}
            >
                {districts.filter(i=>i!=districtOut).map(d=><MenuItem key={d} value={d}>
                    {DistrictsMap[d].label}
                </MenuItem>)}
            </Select>
        </FormControl>
            </Box>
            const dout = <Box marginTop={'.5em'}>
            <Typography variant='body2' fontWeight={'bold'} marginBottom='1em'>District Out*</Typography>
            <FormControl fullWidth>
            <InputLabel id="disctrict-out-lbl">District</InputLabel>
            <Select
            labelId="disctrict-out-lbl"
            id="disctrict-out"
            value={districtOut}
            label="District"
            onChange={onChangeDistrictOut}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label={DistrictsMap[selected].label} />
                </Box>
                )}
            >
                {districts.map(d=><MenuItem key={d} value={d}>
                    {DistrictsMap[d].label}
                </MenuItem>)}
            </Select>
        </FormControl>
            </Box>
            if(boths){
                return <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>{dout}</Grid>
                    <Grid item xs={12} sm={6}>{din}</Grid>
                </Grid>
            }
            else
                return <Box marginTop={'.5em'}>
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
                        <Chip key={value} label={DistrictsMap[value].label} />
                        ))}
                    </Box>
                    )}
                >
                {districts.map(d=><MenuItem key={d} value={d}>
                    {DistrictsMap[d].label}
                </MenuItem>)}
                </Select>
            </FormControl>
                
                </Box>
        }
        return <></>
    }

    const renderDateControls = ()=>{
        if(periodType=='weekly'){
            return <Grid container spacing={1}>
            
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel id="select-week-from">Select the week you want to explore from.</InputLabel>
                    <Select
                    labelId="select-week-from"
                    value={weekFrom}
                    label="Select the week you want to explore."
                    onChange={onChangeWeekFrom}
                    >
                        {renderWeeksMenuItems()}
                    </Select>
                </FormControl>

            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel id="select-week-to">Select the week you want to explore to.</InputLabel>
                    <Select
                    labelId="select-week-to"
                    value={weekTo}
                    label="Select the week you want to explore."
                    onChange={onChangeWeekTo}
                    >
                        {renderWeeksMenuItems(true)}
                    </Select>
                </FormControl>

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
                            onChange={onChangeYears}
                            >
                                {renderYearsMenuItems()}
                            </Select>
                        </FormControl>
            </Box>
        }
        return <></>
    }

    const renderLocationMenuItems = ()=>{
        let l = {...locations};
        if(isMobilityOrEvent())
            delete l[2]
        return Object.entries(l).map(([k,v,])=><MenuItem value={k} key={k}>{v}</MenuItem>)
    }

    const onChangePeriodType = (e)=>{
        setPeriodType(e.target.value)
        // setDataMovilityAndEvents(()=>props.data[e.target.value])
    }

    return <Box>
        <style jsx global>
            {`
                .state{
                    transition: fill .8s;
                }
            `}
        </style>
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
                        </Box>
                        <Box marginTop={'.5em'}>
                            <Typography variant='body2' fontWeight={'bold'} marginBottom='1em'>Topic*</Typography>
                            <FormControl fullWidth>
                                <InputLabel id="select-topic">Select the topic you want to explore.</InputLabel>
                                <Select
                                labelId="select-topic"
                                value={topic}
                                label="Select the topic you want to explore."
                                onChange={onChangeAlgoritm}
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
                                value={location}
                                label="Select the topic you want to explore."
                                onChange={onChangeLocation}
                                >
                                {renderLocationMenuItems()}
                                </Select>
                            </FormControl>
                        </Box>
                        {renderDistrictControls()}
                        <Box>
                        {/* <FormControl fullWidth>
                            <FormControlLabel control={<Checkbox
                                checked={excludeOutEqIN}
                                onChange={(e)=>setExcludeOutEqIN(!excludeOutEqIN)}
                                inputProps={{ 'aria-label': 'Exclude out equals to in' }}
                                />}   label="Exclude out equals to in" /> 
                        </FormControl> */}

                        </Box>
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
                <Box sx={{padding:'.8em'}}>
                    <Typography color='primary' fontWeight={'bold'} textTransform={'uppercase'} variant='h6' >
                        SAFE ANSWER
                    </Typography>
                    <Box>
                    {renderBreadcrumbs()}
                    </Box>
                    {topics[topic]?<Typography fontStyle={'italic'}>{topics[topic].name}: {topics[topic].description}</Typography>:undefined}
                    <Divider sx={{margin:'.5em 0'}} />
                        <Box>
                            {dataMovilityAndEvents ? <MapMovilityAndEvents></MapMovilityAndEvents>:<></>}
                            {dataDensityAndSubscribers ? <MapDensityAndSubscribers></MapDensityAndSubscribers>:<></>}

                        </Box>
                </Box>
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

// export const getServerSideProps = async ()=>{debugger;
//     const url ='http://localhost:3000/api/yearly?topic=mobility_events'
//     // const basePath = [process.cwd(),'public','static','data']
// const res = await fetch(url).then(r=>r.json()).then(d=>d)
//     // const mdsP = path.join(...basePath,'monthly','density_subscribers.csv')
//     // const mmeP = path.join(...basePath,'monthly','mobility_events.csv')

//     // const wdsP = path.join(...basePath,'weekly','density_subscribers.csv')
//     // const wmeP = path.join(...basePath,'weekly','mobility_events.csv')

//     // const ydsP = path.join(...basePath,'yearly','density_subscribers.csv')
//     // const ymeP = path.join(...basePath,'yearly','mobility_events.csv')

//     // const [mds,mme,wds,wme,yds,yme] = await Promise.all([
//     //     csv().fromFile(mdsP),
//     //     csv().fromFile(mmeP),
//     //     csv().fromFile(wdsP),
//     //     csv().fromFile(wmeP),  
//     //     csv().fromFile(ydsP),  
//     //     csv().fromFile(ymeP),  
//     // ])
    
//     return {
//         props:{
//             res
//             // data:{
//             //     monthly:{
//             //         density_subscribers:mds,
//             //         mobility_events:mme
//             //     },
//             //     weekly:{
//             //         density_subscribers:wds,
//             //         mobility_events:wme
//             //     },
//             //     yearly:{
//             //         density_subscribers:yds,
//             //         mobility_events:yme
//             //     }
//             // }
//         }
//     }
// }
export default Home
