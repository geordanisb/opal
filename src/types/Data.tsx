
export type Topic = 'movement'|'density'|'subscribers'|'call_out'|'sms_out'
export interface MonthlyDensitySubscriber {
  date:string;
  district_in:number;
  density:number;
  subscribers:number;
}
export interface MonthlyMobilityEvent{
  date:string;
  district_in:number;
  district_out:number;
  sms_in:number; 
  sms_out:number; 
  call_in:number;
  call_out:number; 
  movement:number; 
  average_call_duration:number;
}

export interface WeeklyDensitySubscriber {
  date_from:string;
  date_to:string;
  district_in:number;
  density:number;
  subscribers:number;
}
export interface WeeklyMobilityEvent{
  date_from:string;
  date_to:string;
  district_in:number;
  district_out:number;
  sms_in :number;
  sms_out :number;
  call_in:number;
  call_out :number;
  movement :number;
  average_call_duration:number;
}
export interface YearlyDensitySubscriber {
  date:string;
  district_in:number;
  density:number;
  subscribers:number;
}
export interface YearlyMobilityEvent{
  date:string;
  district_in:number;
  district_out:number;
  sms_in :number;
  sms_out :number;
  call_in:number;
  call_out :number;
  movement :number;
  average_call_duration:number;
}

