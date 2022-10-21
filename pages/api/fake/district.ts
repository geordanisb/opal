import { faker } from '@faker-js/faker';
import {District} from '@/types/district';

export default function district(req, res) {
  const districts:District[] = [];
  const {qty:q} = req.query;
  const qty = q ? parseInt(q) : 100;

  const createRandomD = ():District=> {
    return {
      Date_From:faker.datatype.datetime(),
      Date_To:faker.datatype.datetime(),
      District_OUT:faker.company.name(),
      District_IN:faker.company.name(),
      Number_of_Subscribers_IN:faker.datatype.number(),
      Number_of_Subscribers_OUT:faker.datatype.number(),
      Density_km2_IN:faker.datatype.number(),
      Density_km2_OUT:faker.datatype.number(),
      Number_of_SMS_IN:faker.datatype.number(),
      Number_of_SMS_OUT:faker.datatype.number(),
      Number_of_Calls_IN:faker.datatype.number(),
      Number_of_Calls_OUT:faker.datatype.number(),
      Movement:faker.datatype.string(),
    }
  }
   for(let i=0;i<qty;i++){
    const d = createRandomD()
    districts.push(d) 
   }
  
  res.status(200).json({ districts })
}
