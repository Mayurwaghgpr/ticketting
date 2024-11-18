import axios from "axios";
import { useState } from "react"
import useRequest from "../../hooks/use-request";
import Router from "next/router"
export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const { doRequest, errors } = useRequest({
        url: "/api/user/signup",
        method: "post",
        body: {
            email,password
        },
        onSuccess: ()=> Router.push('/')
    });
    const handelsubmit = async (e) => {
        e.preventDefault();
      doRequest()
    }
 
    return (
         <div className=" flex justify-center h-[40rem] items-center">
            <form className="flex flex-col gap-3 p-3 w-[20rem]" onSubmit={handelsubmit}> 
            <h1 className=" text-2xl">Sign Up</h1>
            <div className="flex flex-col">
                <label>
                    email address
                </label>
                <input value={email} onChange={e => setEmail(e.target.value)} className=" border rounded-sm " type="email" />
            </div>
            <div className="flex flex-col">
                <label>
                    password
                </label>
                <input value={password}onChange={e=>setPassword(e.target.value)} className=" border rounded-sm " type="password" />
            </div>
            {errors}

            <div>
                <button className="bg-blue-300 p-2 rounded-lg" type="submit">submit</button>
            </div>
            </form>
        </div>
    )
}