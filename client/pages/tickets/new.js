import { useState } from "react";
import Router from "next/router"
import useRequest from "../../hooks/use-request";
const Newticket = () => {
    const [title,setTitle] = useState();
    const [price, setPrice] = useState()

    const {doRequest,errors } = useRequest({
        url: "/api/tickets",
        method: "post",
        body: {
            title,
            price
        },
        onSuccess:()=> Router.push('/')
    })
    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return
        }
        setPrice(value.toFixed(2))
        
    }
    const handlForm = (e) => {
        e.preventDefault();
        doRequest()
    }
    return (
        <div className="">
            <h1 className=" text-4xl"> Create a ticket</h1>
            <form  onSubmit={handlForm} className="  w-[25rem] p-3 flex flex-col gap-2 bg-slate-100">
                <div className=" flex flex-col gap-2">
                <label htmlFor="">Title</label>
                <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)}/></div>
                <div className=" flex flex-col gap-2">
                    <label>Price</label>
                    <input type="number" onBlur={onBlur} value={price}  onChange={(e)=>setPrice(e.target.value)}/>
                </div>
                {errors}
                <button type="submit" className="bg-blue-200 w-fit rounded-lg p-1">submit</button>
            </form>
        </div>
    )
}

export default Newticket;
