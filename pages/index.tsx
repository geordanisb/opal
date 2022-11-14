import {  Alert, Breadcrumbs, Button, CircularProgress, Divider, FormControl, Backdrop, Grid, InputLabel, MenuItem, Select, Snackbar, Typography, Chip, Drawer, IconButton, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';
import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react';
import useDrawMapAndGraphByDistrictVegaLite from '@/src/hooks/useDrawMapAndGraphByDistrictVegaLite';
import { ArrowForward, HighlightOff, NavigateNext } from '@mui/icons-material';
import moment from 'moment'
import { DataMonthly, DataWeekly, DataYearly } from '@/src/types/Data';
// import { DataGrid, GridValueGetterParams } from '@mui/x-data-grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import csv from 'csvtojson'
import path from 'node:path'
import { NextPage } from 'next';
import { DistrictsMap } from '@/src/constants';

const algoritms = {
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
interface Props{
    data:{
        monthly:DataMonthly[],
        weekly:DataWeekly[],
        yearly:DataYearly[],
    }
}

const Home:NextPage<Props> = (props) => {
  const yearsMap = [2020,2021,2022]

  const [error,setError] = useState('')

  const [algorithm,setAlgoritm] = useState<string>('movement')

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


  const [data,setData] = useState<(DataMonthly|DataWeekly|DataYearly)[]>([])

  const [loading,setLoading] = useState(false)
  const [doRender,setDoRender] = useState(false)
  const [excludeOutEqIN,setExcludeOutEqIN] = useState(false)
  const {Map} = useDrawMapAndGraphByDistrictVegaLite(district,districtIn,districtOut,algorithm,data,doRender)

  const [drawerShow,setDrawerShow] = useState(true) 

  const onChangeAlgoritm = (e)=>{
    const v = e.target.value
    setAlgoritm(v)

    setLocation(1)
    setDistrict([])
    setPeriodType('weekly')
    setYears('')
    setMonths('')
    setWeekFrom('')
    setWeekTo('')
    setData([])  

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
    setData(()=>[])    

  }

  const onChangeDistrict = (e)=>{
    setDistrict(e.target.value)
    setDistrictIn('')
    setDistrictOut('')
    setData(()=>[])    
  }

  const onChangeDistrictIn = (e)=>{
    setDistrictIn(e.target.value)
    setDistrict([])
    setData([])    
  }

  const onChangeDistrictOut = (e)=>{
    setDistrictOut(e.target.value)
    setDistrict([])
    setDistrictIn('')
    setData([])    
  }

  const onChangeYears = (e)=>{
    setYears(e.target.value)
    setMonths('')
    setData(()=>[])    
  }

  const onChangeMonths = (e)=>{
    setMonths(e.target.value)
    setWeekFrom('')
    setWeekTo('')

    setData(()=>[])    
  }

  const onChangeWeekFrom = (e)=>{
    setWeekFrom(e.target.value)
    setData(()=>[])    
  }

  const onChangeWeekTo = (e)=>{
    setWeekTo(e.target.value)
    setData(()=>[])    
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
    return algorithm && location && (district&&district.length || districtIn&&districtOut)  && validDates()
  }

  const reset = ()=>{
    setAlgoritm('movement')
    setLocation(1)
    setDistrict([])
    setPeriodType('weekly')
    setYears('')
    setMonths('')
    setWeekFrom('')
    setWeekTo('')
    setData([])
  }

  const submit =  (e)=>{
    e.preventDefault()
    setLoading(true)
    let d=[];

    if(periodType == 'weekly' && weekFrom&&weekTo){
        const date_from = moment(weekFrom.split('-')[0],'DD-MM-YYYY')
        const date_to = moment(weekTo.split('-')[1],'DD-MM-YYYY')
        
        d = props.data.weekly.filter(i=>{
            const df = moment(i.date_from,'DD-MM-YYYY')
            const dt = moment(i.date_to,'DD-MM-YYYY')
            const q1 = df.isBetween(date_from,date_to,undefined,'[]')
            const q2 = dt.isBetween(date_from,date_to,undefined,'[]')
            return q1 && q2
        })
    }
    else if(periodType == 'monthly' && months){
        d = props.data.monthly.filter(i=>{
            return months == i.date
        })
    }
    else if(periodType == 'yearly' && years){
        d = props.data.yearly.filter(i=>{
            return years == i.date
        })
    }
    if(excludeOutEqIN)
            d = d.filter(i=>i.district_out != i.district_in)
    if(districtOut && districtIn){
        const o = d.filter(i=>(i.district_out == districtOut && i.district_in == districtIn))
        const i = d.filter(i=>(i.district_in == districtOut && i.district_out == districtIn))
        d = [...o,...i]
    }
      
    else if(district && district.length)    
        d = d.filter(i=>district.includes(i.district_out))
    
    setData(d)
    setDoRender(true)
    setLoading(false)
    d.length ? setDrawerShow(false):setDrawerShow(true)
    
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

    const renderWeeksMenuItems = (validateTo=false)=>{
        let weeks = []
        if(periodType=='weekly'){
            props.data.weekly.reduce((p,c)=>{
                const k = `${c.date_from}-${c.date_to}`
                if(weekFrom && validateTo){
                    const cy = moment(c.date_from,'DD-MM-YYYY')
                    const [date_from,date_to] = weekFrom.split('-')
                    if(moment(c.date_to,'DD-MM-YYYY').isAfter(moment(date_to,'DD-MM-YYYY')))
                        p.push(k)

                    return p;
                }
                // else if(years && months){
                //     const cy = moment(c.date_from,'DD-MM-YYYY')
                //     if(years.includes(cy.year().toString())){
                //         if(months.split('-')[1].includes(`${cy.month()+1}`))
                //             p.push(k)
                //     }
                //     return p;
                // }
                // else if(years){
                //     const cy = moment(c.date_from,'DD-MM-YYYY')
                //     if(years==cy.year().toString()){
                //         p.push(k)
                //     }
                //     return p;
                // }
                else{
                    p.push(k)
                    return p;
                }
            },weeks)
            weeks =  Array.from(new Set(weeks))
            return weeks.map(y=><MenuItem key={y} value={`${y}`}>{y}</MenuItem>)

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
                    (<Typography display={'inline'} fontWeight={'bold'}>{`${DistrictsMap[districtOut].label} -> ${DistrictsMap[districtIn].label}`}</Typography>)
                </>
        }
        return <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext/>}>
            <Typography fontWeight={'bold'}>Dataland</Typography>
            {algoritms[algorithm]?<Typography fontWeight={'bold'}>{algoritms[algorithm].name}</Typography>:undefined}
            {locations[location]?<Typography fontWeight={'bold'}>{locations[location]} {renderDistricts()}</Typography>:undefined}
            
            {renderDateBreadcrumb()}
        </Breadcrumbs>
    }

    const renderDistrictControls = ()=>{
        
        if(location == 1){
            const boths = ['movement','events'].includes(algorithm)
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

    const onChangePeriodType = (e)=>{
        setPeriodType(e.target.value)
        setData(()=>props.data[e.target.value])
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
                                <InputLabel id="select-algorithm">Select the algorithm you want to explore.</InputLabel>
                                <Select
                                labelId="select-algorithm"
                                value={algorithm}
                                label="Select the algorithm you want to explore."
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
                                label="Select the algorithm you want to explore."
                                onChange={onChangeLocation}
                                >
                                {Object.entries(locations).map(([k,v,])=><MenuItem value={k} key={k}>{v}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>
                        {renderDistrictControls()}
                        <Box>
                        <FormControl fullWidth>
                            <FormControlLabel control={<Checkbox
                                checked={excludeOutEqIN}
                                onChange={(e)=>setExcludeOutEqIN(!excludeOutEqIN)}
                                inputProps={{ 'aria-label': 'Exclude out equals to in' }}
                                />}   label="Exclude out equals to in" /> 
                        </FormControl>

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
                    {algoritms[algorithm]?<Typography fontStyle={'italic'}>{algoritms[algorithm].name}: {algoritms[algorithm].description}</Typography>:undefined}
                    <Divider sx={{margin:'.5em 0'}} />
                        <Box>
                            <Map></Map>
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
export const getServerSideProps = async ()=>{
    const mp = path.join(process.cwd(),'public','static','data','opal_synthetic','monthly.csv')
    const wp = path.join(process.cwd(),'public','static','data','opal_synthetic','weekly.csv')
    const yp = path.join(process.cwd(),'public','static','data','opal_synthetic','yearly.csv')
    
    const [monthly,weekly,yearly] = await Promise.all([
        csv().fromFile(mp),
        csv().fromFile(wp),
        csv().fromFile(yp)  
    ])
    
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
