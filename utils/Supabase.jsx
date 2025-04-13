import {supabase} from "~/lib/supabase.ts";

const CUSTOMERS ='User';
export const fetchCustomer = async (customerId, setCustomer) =>{
        let { data, error } = await supabase.from(CUSTOMERS).select('*').eq('id', customerId)
        if(error){
            return;
        }
        setCustomer(data[0]);
        // console.log("data", data);
}
  
 export const updateLocation = async (customerId, latitude, longitude, Address) =>{
    let { data, error } = await supabase
       .from('User')
       .update({latitude, longitude, Address})
       .eq('id', customerId)
       if(error){
        return;
        }
 }