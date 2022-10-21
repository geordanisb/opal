import { faker } from '@faker-js/faker';
import { Neighborhood } from '@/src/types/neightborhood';

export default function neightborhood(req, res) {
  const neighborhoods:Neighborhood[] = [];
  const {qty:q} = req.query;
  const qty = q ? parseInt(q) : 100;

  const createRandomNH = ():Neighborhood=> {
    return {
      Date_From:faker.datatype.datetime(),
      Date_To	:faker.datatype.datetime(),
      NH_OUT:faker.company.name(),	
      NH_IN:faker.company.name(),	
      Number_of_Subscribers_IN:faker.datatype.number(),	
      Number_of_Subscribers_OUT:faker.datatype.number(),	
      Density_km2_IN:faker.datatype.number(),	
      Density_km2_OUT:faker.datatype.number(),	
      Number_of_SMS_IN:faker.datatype.number(),	
      Number_of_SMS_OUT:faker.datatype.number(),	
      Number_of_Calls_IN:faker.datatype.number(),	
      Number_of_Calls_OUT:faker.datatype.number(), 	
      Movement:faker.datatype.string()
    }
  }
   for(let i=0;i<qty;i++){
    const d = createRandomNH()
    neighborhoods.push(d) 
   }
  
  res.status(200).json({ neighborhoods })
}
