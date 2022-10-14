// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {readFile} from "fs"
import path from "node:path"
export default function hello(req, res) {
  if(req.method=='GET'){debugger;
    
    const p =path.join(process.cwd(),'geojson','usa.json')
    readFile(p,(err,data)=>{
      if(err)throw err;

      return res.status(200).json(JSON.parse(data))
    })
  }
}
