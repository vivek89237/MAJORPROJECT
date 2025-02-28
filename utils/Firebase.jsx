import {firestore} from "../firebaseConfig.js";
import {ToastAndroid} from 'react-native';
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
import { getDatabase, ref, onValue } from "firebase/database";

let ordersRef = collection(firestore, "orders");
let vendorRef = collection(firestore, "vendors");
let customerRef = collection(firestore, "customers");
let postRef = collection(firestore, "vendors");

// let postRef = doc(firestore, "users","51usiD0xVo3ba8Nd539w");

// export const uploadVehicleInfo =(object)=>{
//     addDoc(postRef, object)
//     .then((res) => {
//         toast.success('Document has been uploaded.');
//     })
//     .catch((err) =>{
//         toast.error(err);
//     })
// }

export const getVehicleInfo = (setAllStatus) =>{
    onSnapshot(vendorRef, response =>{
        setAllStatus(response.docs.map((docs)=>{
            //console.log(docs.data)
            return {...docs.data(), id: docs.id}
        }))
        // console.log(response.docs.map((docs)=>{
        //     return {...docs.data(), id: docs.id}
        // }));
    })
}

export const getCustomer = (customerContact, setCustomer) =>{
    //console.log(typeof customerContact)
    let customerQuery = query(customerRef, where('ContactNo', '==', customerContact));
    onSnapshot(customerQuery, response =>{
        setCustomer(response.docs.map((docs)=>{
            return {...docs.data(), id: docs.id}
        })[0])
        // console.log(response.docs.map((docs)=>{
        //     return {...docs.data(), id: docs.id}
        // })[0]);
    })
}


export const updateVehicleInfo =(ContactNo, latitude, longitude)=>{

    let vendorQuery = query(vendorRef, where('ContactNo', '==', ContactNo));

    onSnapshot(vendorQuery, response =>{
        let docId = response.docs.map((docs)=>{
            return docs.id;
        });
        let postToEdit = doc(vendorRef, docId);

        updateDoc(postToEdit, {latitude: latitude, longitude: longitude})
        .then((res) => {
            ToastAndroid.show('Coordinates Updated', ToastAndroid.SHORT);
        })
        .catch((err) =>{
            ToastAndroid.show('Error', ToastAndroid.SHORT);
        })
    })
}


export const getPosts = (ContactNo, setData) =>{
    let commentQuery = query(postRef, where('ContactNo', '==', ContactNo));
    
    
    onSnapshot(commentQuery, response =>{

            let comments = response.docs.map((docs)=>docs.data());
            // console.log(comments)
            console.log(comments)
            setData(comments[0]?.vegetables);


        // console.log(response.docs.map((docs)=>{
        //     return {...docs.data(), id: docs.id}
        // }));
    })
}


export const getVendorCoordinates = (ContactNo, setData) =>{
    let vendorQuery = query(vendorRef, where('ContactNo', '==', ContactNo));
    onSnapshot(vendorQuery, response =>{
            let data = response.docs.map((docs)=>docs.data());
            //console.log(data[0].latitude);
            setData([ data[0].longitude,data[0].latitude]);
            //setData(coordinates);
    })
}

export const getCustomerInfo = (ContactNo, setData) =>{
    let customerQuery = query(customerRef, where('ContactNo', '==', ContactNo));
    onSnapshot(customerQuery, response =>{
            let data = response.docs.map((docs)=>docs.data());
            console.log(data);
            setData(data);
    })
}

export const getComment=(postID, setComments)=>{
    try{
        let commentQuery = query(commentsRef, where('postID', '==', postID));
        onSnapshot(commentQuery, (response) =>{   
            let comments = response.docs.map((docs)=>docs.data());
            // console.log(comments)
            setComments(comments)
        })
    }catch(e){
        return e;
    }
}

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