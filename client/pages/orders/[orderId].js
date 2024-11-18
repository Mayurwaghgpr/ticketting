import client from "../../apis/build-client"
import Router from "next/router";
import Script  from "next/script"
import { useEffect, useState } from "react"
import useRequest from "../../hooks/use-request";
const OrderShow = ({ order,currentuser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
      const { doRequest,errors} = useRequest({
        url: '/api/payments', method: 'post',
        body: {orderId:order.id},
        onSuccess: (data) =>{
            console.log(data)
            // Router.push("/orders/success");
        }  
    })
    console.log(order)
useEffect(() => {
function checkTimeleft() {
    const msLeft = new Date(order.expiresAt) - new Date();
    setTimeLeft(Math.floor(msLeft/1000))
}
    checkTimeleft();

    const IntervelId = setInterval(checkTimeleft,1000)

    return () => {
      clearInterval(IntervelId)
  }
}, [order])
    const handlecheckout = () => {


        let options = {
            "key": "rzp_test_9wNqsLBvmFbPeE", // Enter the Key ID generated from the Dashboard
             "amount": order.ticket.price * 100,// Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "ticketting",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": async function (response) {
      const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = response;

                // Send payment details to the backend for verification

                console.log("cpmpletc")
                doRequest({razorpayPaymentId, razorpayOrderId, razorpaySignature })


    },
            "prefill": {
                "name": "Gaurav Kumar",
                "email": currentuser.email,
                "contact": "9000090000"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        if (window.Razorpay) {
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } else {
      console.error("Razorpay script not loaded");
    }
    }

    if (timeLeft < 0) {
  
   
        <div>Order Expired</div>
            return   Router.push('/')

    }

    return (<div className="">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <h1>Time left to pay {timeLeft}</h1>
        <div><button onClick={handlecheckout}>Pay now</button></div>
    </div>)
    
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    console.log(orderId)
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data }
    
}

export default OrderShow;