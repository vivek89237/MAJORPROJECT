import {supabase} from "~/lib/supabase.ts";

const CUSTOMERS ='User';
export const fetchCustomer = async (customerId, setCustomer) =>{
        let { data, error } = await supabase.from(CUSTOMERS).select('*').eq('id', customerId)
        if(error){
            console.log(error);
            return;
        }
        setCustomer(data[0]);
        // console.log("data", data);
}
  
 