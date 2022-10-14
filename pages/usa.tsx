import { North } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import Head from "next/head";
import React,{FC, useEffect, useState}  from "react";
import styles from './usa.module.css'

const USAPage: FC = ()=>{
    const [geojson,setGeoJSON] = useState<{features:any}>()
    const [globe,setGlobe] = useState()
    const [path,setPath] = useState()


    useEffect(()=>{
        const init = async ()=>{
                const d3 = (window as (typeof window & {d3})).d3
                const {json} = d3;
                json('/api/geojson').then(data=>{
                    console.log(data)
                    setGeoJSON(data)
                })
        }
        init()
    },[])
    const genGlobe = (d3)=>{
        const g = d3.select('.globe').append('svg')
        .attr("viewBox", [0, 0, 300, window.innerHeight])
                    .attr('width',window.innerWidth)
                    .attr('height',window.innerHeight)
        return g;
    }
    const genProjection = (d3)=>{
        return d3.geoMercator().fitSize([window.innerWidth,window.innerHeight],geojson)
        .translate([window.innerWidth - window.innerWidth,window.innerHeight/2])
    }
    const genPath = (d3)=>{
        return d3.geoPath().projection(genProjection(d3))
    }
    const genStates = (d3,globe,path)=>{
        return globe.selectAll('path')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr('id',(d)=>d.properties.NAME.replace(/\s/g,''))
        .attr('class','state')
        .join("path")
        .on('mouseenter',(e,d)=>{debugger;
            const name = d.properties.NAME
            const id=name.replace(/\s/g,'')
           d3.select(`#${id}`).style('fill','red') 
           d3.select('.info-panel').style('background','blue').html(name)
        })
        .on('mouseleave',(e,d)=>{
            globe.selectAll('path').style('fill','orange')    
            d3.select('.info-panel').style('background','blue')
            .html(' ')
        })
            
        .attr('d',path)
        .attr("cursor", "pointer")
        .attr("stroke", "gray")
        .attr("stroke-linejoin", "round")
        .style('fill','orange')
    }
    useEffect(()=>{
        if(geojson){
            const d3 = (window as (typeof window & {d3})).d3;

            const globe = genGlobe(d3) 
            const path = genPath(d3)
            const states = genStates(d3,globe,path)

        }

    },[geojson])
    return        <Box>

    <style jsx global>
                {`
                .state{
                    transition: fill .5s;
                }
                `}
            </style>
    <North sx={{color:'orange'}}/>
    <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
            <article className="info-panel">{' '}</article>
        </Grid>
        <Grid item xs={12} md={10} className="map">
            
            <section className='globe'></section>
        </Grid>
    </Grid>
    </Box>

}

export default USAPage;