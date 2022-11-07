// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {readFile} from "fs"
import path from "node:path"
import { promisify } from "util";

export default async function index(req, res) {
  if(req.method=='GET'){
    const {district} = req.query
    const p =path.join(process.cwd(),'public','data',`maldiva.${district}.topojson.json`)
    const readFilePromise = promisify(readFile)
    try{
      const d = await readFilePromise(p)
      return res.status(200).json(JSON.parse(d))
    }
    catch(e){
      console.error(e);
      res.status(500).json({error:e.toString()})
    }
  }
}
