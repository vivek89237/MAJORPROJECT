import { collection, addDoc } from "firebase/firestore";
import { firestore } from "./firebaseConfig"; 


const orderRef = collection(firestore, "orders"); // Create a reference to the orders collection

const uploadCartItems = async (cart, VendorName, total, navigation, ContactNo, deliveryAddress, customerContact, customerCoordinates, selectedDate, isScheduled) => {
   
  try {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB').split('/').join('-');
        

    const filteredCart = cart.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity,
      }));
      const uniqueOrderId = `${VendorName}-1-${(new Date()).toISOString()}`;
      
      
      await addDoc(orderRef, { cart: filteredCart, VendorName:VendorName, date:formattedDate, location: deliveryAddress, status:"Pending", total:total, orderId: uniqueOrderId, vendorContactNo:ContactNo, customerContact:customerContact, customerCoordinates:[75.905966, 22.743242] ,isRated: false, deliveryDate:selectedDate, isScheduled:isScheduled});
      // console.log("date is ",selectedDate,isScheduled);
    console.log("Cart items uploaded successfully!");
    navigation.navigate('OrderConfirmation');

  } catch (error) {
    console.error("Error uploading cart items: ", error);
  } 
};

export default uploadCartItems;