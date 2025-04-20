import { PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';
import { fetchCustomer } from "~/utils/Supabase";
import { useAuth } from './AuthProvider';

const CustomerContext = createContext({});

export default function CustomerProvider({ children }: PropsWithChildren) {
  const [customer, setCustomer] = useState({});
  const { userId } = useAuth();

  const refreshCustomer = async () => {
    await fetchCustomer(userId, setCustomer);
  };

  useEffect(() => {
    refreshCustomer();
  }, [userId]);

  return (
    <CustomerContext.Provider value={{
      setCustomer,
      refreshCustomer, // 
      customerId: customer?.id,
      customerName: customer?.Name,
      customerContact: customer?.ContactNo,
      customerAddress: customer?.Address,
      customerImage: customer?.image,
      customerCoordinates: [customer?.latitude, customer?.longitude],
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomer = () => useContext(CustomerContext);
