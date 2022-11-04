import { District } from '@/src/types/district'
import { NavigateNext } from '@mui/icons-material'
import { Box, Breadcrumbs, Button, Container, Divider, FormControl, Grid, Input, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React,{ FunctionComponent, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface Props {
    districts:District[]
}
const DatalandPage: FunctionComponent<Props> = ({districts})=>{
    const columns = [
        {field:'Date_From',headerName:'Date From',width:100},
        {field:'Date_To',headerName:'Date To',width:100},
        {field:'District_OUT',headerName:'District OUT',width:100},
        {field:'District_IN',headerName:'District IN',width:100},
        {field:'Number_of_Subscribers_IN',headerName:'Number of Subscribers_IN',width:100},
        {field:'Number_of_Subscribers_OUT',headerName:'Number of Subscribers_OUT',width:100},
        {field:'Density_km2_IN',headerName:'Density/km2 IN',width:100},
        {field:'Density_km2_OUT',headerName:'Density/km2 OUT',width:100},
        {field:'Number_of_SMS_IN',headerName:'Number of SMS IN',width:100},
        {field:'Number_of_SMS_OUT',headerName:'Number of SMS OUT',width:100},
        {field:'Number_of_Calls_IN',headerName:'Number of Calls IN',width:100},
        {field:'Number_of_Calls_OUT',headerName:'Number of Calls OUT',width:100},
        {field:'Movement',headerName:'Movement',width:100},
    ]

    // const renderHeaderRow = ()=>{
    //     const tr = columns.map(r=>{
    //         return <TableCell>{r.headerName}</TableCell>
    //     })
    //     return <TableRow>
    //         {tr}
    //     </TableRow>
    // }
    // const renderBodyRows = ()=>{
    //     return districts.map(r=>{
    //         return <TableRow key={`${r.Date_From}-${r.Date_To}-${r.District_IN}-${r.District_OUT}`}>
    //             {columns.map(c=>{
    //                 return <TableCell>{r[c.field]}</TableCell>
    //             })}
    //     </TableRow>
    //     })
        
    // }
      

    return <Container>
        <style jsx global>
            {`
                .state{
                    transition: fill .8s;
                }
            `}
        </style>
                <Grid container spacing={2}sx={{paddingBottom:'16em'}} >
                    <Grid item xs={12} >
                        <Typography color='skyblue' fontWeight={'bold'} textTransform={'uppercase'} variant='h6' sx={{margin:'.5em 0 0'}}>Districts</Typography>

                        <Box>
                        <div style={{ height: 500, width: '100%' }}>
                            <DataGrid
                                getRowId={(r)=>`${r.Date_From}-${r.Date_To}-${r.District_IN}-${r.District_OUT}`}
                                autoPageSize 
                                pagination 
                                rows={districts}
                                columns={columns}
                                checkboxSelection
                            />

                        </div>
                        </Box>
                        {/* <Box>
                         <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    {renderHeaderRow()}
                                
                                </TableHead>
                                <TableBody>
                                {renderBodyRows()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </Box> */}
                    </Grid>
                    
                </Grid>

    </Container> 
}
export const getServerSideProps = async ()=>{
    const r = await fetch(`${process.env.SERVER_PATH}/api/fake/district`)
    const json =await  r.json()
    const {districts} = json
    return {
        props:{
            districts
        }
    }
}
export default DatalandPage

