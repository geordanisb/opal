export interface DataMonthly {
  date:string;
  district_in:string;
  district_out:string;
  district_in_encoded:string;
  district_out_encoded:string;
  density:number;
  subscribers:number;
  sms_in :number;
  sms_out :number;
  call_in:number;
  call_out :number;
  movement :number;
  average_call_duration:number;
  }

  export interface DataWeekly {
    date_from:string;
    date_to:string;
    district_in:string;
    district_out:string;
    district_in_encoded:string;
    district_out_encoded:string;
    density:string;
    subscribers:string;
    sms_in :string;
    sms_out :string;
    call_in:string;
    call_out :string;
    movement :string;
    average_call_duration:string;
  }

  export interface DataYearly {
    date:string;
    district_in:string;
    district_out:string;
    district_in_encoded:string;
    district_out_encoded:string;
    density:number;
    subscribers:number;
    sms_in :number;
    sms_out :number;
    call_in:number;
    call_out :number;
    movement :number;
    average_call_duration:number;
  }