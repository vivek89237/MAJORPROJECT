import {firestore} from "../../firebaseConfig.js"; //configFile
import { 
    addDoc, 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc,
    query, 
    where, 
    setDoc, 
    deleteDoc 
} from 'firebase/firestore';

let ordersRef = collection(firestore, "orders");

export const getOrders=(vendorContactNo, setOrders)=>{
    try{
        let ordersQuery = query(ordersRef,  where('status','==','Accepted'), where('customerContact','==',vendorContactNo));
        onSnapshot(ordersQuery, (response) =>{   
            let orders = response.docs.map((docs)=>docs.data());
            setOrders(orders)
        })
    }catch(e){
        return e;
    }
}