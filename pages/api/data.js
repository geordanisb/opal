// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import csv from 'csvtojson'
import path from 'node:path'
import moment from 'moment';

export default async function Index(req, res) {
  const {district,from,to} = req.query;
  const p = path.join(process.cwd(),'pages','api','data.csv')
  let data = await csv().fromFile(p) 
  data.forEach(d=>{
    const f = d.date_from.split('/').reverse().join('-')
    d.date_from = f
    const t = d.date_to.split('/').reverse().join('-')
    d.date_to = t
  })
  if(district){
    data = data.filter(d=>d.district_out == district || d.district_in == district)
  }
  if(from && to){
    data = data.filter(d=>moment(from).isBetween(d.date_from,d.date_to,undefined,"[]") && moment(to).isBetween(d.date_from,d.date_to,undefined,"[]") )
  }
  else if(from){
      data = data.filter(d=>moment(from).isBetween(d.date_from,d.date_to,undefined,"[]") )
  }
  else if(to){
    data = data.filter(d=>moment(to).isBetween(d.date_from,d.date_to,undefined,"[]"))
  }
  res.status(200).json({ data, count:data.length })
}
