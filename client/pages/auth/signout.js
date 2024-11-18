import axios from "axios";
import { useEffect, useState } from "react"
import useRequest from "../../hooks/use-request";
import Router from "next/router"
export default () => {
    const { doRequest, errors } = useRequest({
        url: "/api/user/signout",
        method: "post",
        body: {},
        onSuccess: ()=> Router.push('/')
    });
    useEffect(() => {
        doRequest();
    },[])

 
    return (
         <div className=" flex justify-center h-[40rem] items-center">
            <h1 className=" text-2xl">Signing out..</h1>
        </div>
    )
}