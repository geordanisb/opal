import { NavigateNext } from '@mui/icons-material'
import { Box, Breadcrumbs, Button, Container, Divider, FormControl, Grid, Input, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React,{ FunctionComponent, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Neighborhood } from '@/src/types/neightborhood';

interface Props {
    neighborhoods:Neighborhood[]
}
const DatalandPage: FunctionComponent<Props> = ({neighborhoods})=>{
    const columns = [
        {field:'Date_From',headerName:'Date From',width:100},
        {field:'Date_To',headerName:'Date To',width:100},
        {field:'NH_OUT',headerName:'NH OUT',width:100},
        {field:'NH_IN',headerName:'NH IN',width:100},
        {field:'Number_of_Subscribers_IN',headerName:'Number of Subscribers IN',width:100},
        {field:'Number_of_Subscribers_OUT',headerName:'Number of Subscribers OUT',width:100},
        {field:'Density_km2_IN',headerName:'Density/km2 IN',width:100},
        {field:'Density_km2_OUT',headerName:'Density/km2 OUT',width:100},
        {field:'Number_of_SMS_IN',headerName:'Number of SMS IN',width:100},
        {field:'Number_of_SMS_OUT',headerName:'Number of SMS OUT',width:100},
        {field:'Number_of_Calls_IN',headerName:'Number of Calls IN',width:100},
        {field:'Number_of_Calls_OUT',headerName:'Number of Calls OUT',width:100},
        {field:'Movement',headerName:'Movement',width:100},
    ]

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
                        <Typography color='skyblue' fontWeight={'bold'} textTransform={'uppercase'} variant='h6' sx={{margin:'.5em 0 0'}}>Neighborhoods</Typography>

                        <Box>
                        <div style={{ height: 500, width: '100%' }}>
                            <DataGrid
                                getRowId={(r)=>`${r.Date_From}-${r.Date_To}-${r.NH_IN}-${r.NH_OUT}`}
                                autoPageSize 
                                pagination 
                                rows={neighborhoods}
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
    const r = await fetch(`${process.env.SERVER_PATH}/api/fake/neighborhood`)
    const json =await  r.json()
    const {neighborhoods} = json
    return {
        props:{
            neighborhoods
        }
    }
}
export default DatalandPage

