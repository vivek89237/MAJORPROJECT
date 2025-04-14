import {PropsWithChildren, createContext, useContext, useState, useEffect} from 'react';
import {fetchCustomer} from "~/utils/Supabase";
import { useAuth } from './AuthProvider';

const CustomerContext = createContext({});


export default function CustomerProvider ({children} : PropsWithChildren) {
    const [customer, setCustomer] = useState({});
    const {userId} = useAuth();
    useEffect(()=>{
      fetchCustomer(userId, setCustomer);
    }, [userId, customer])
    return (
    <CustomerContext.Provider value ={{
      setCustomer: setCustomer,
      customerId: customer?.id,
      customerName: customer?.Name, 
      customerContact: customer?.ContactNo, 
      customerAddress : customer?.Address,  
      customerImage: customer?.image,
      customerCoordinates : [customer?.longitude, customer?.latitude,],
      }}>
        {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = () => useContext(CustomerContext);
