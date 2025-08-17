"use client";

import { Sidebar,Topbar,Loading } from "../../component/admin";
// app/components/Layout.tsx

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



const Layout = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkCookie = () => {
            setIsLoading(true);
            // Example: looking for a cookie named "token"
            const hasToken = localStorage.getItem("accessToken") || document.cookie.split(';').some((item) => item.trim().startsWith('token='));

            
            if (!hasToken || hasToken==null || hasToken=='undefined') {
                localStorage.clear()
                router.push("/login");
                setIsLoading(true);    
            }else{

                setIsLoading(false);
            }
        };

        checkCookie()
    }, []);

    if(isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <Loading />
            </div>
        );
    }

    return (
        <div className="flex bg-white text-gray-700">
            <div className="w-64 ">
                <Sidebar />

            </div>
            <div className="flex-1 pr-2">
                <Topbar />
                <main className="p-6 mt-16  w-full  h-[87vh] overflow-y-auto">{children}</main>
            </div>
        </div>
    )
}

export default Layout
