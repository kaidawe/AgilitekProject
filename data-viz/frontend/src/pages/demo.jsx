import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState.jsx";

export default function Header() {
    const prop = useContext(GlobalContext);

    useEffect(() => {
        if (prop.loggedUser && prop.loggedUser !== "Choose a user") {
            console.log("current user is: ", prop.loggedUser);

            if (prop.customers.length > 0) {
                console.log("CUSTOMERS: ", prop.customers);
                ////// can perform actions with CUSTOMERS
            }

            if (prop.integrations.length > 0) {
                console.log("INTEGRATIONS: ", prop.integrations);
                ////// can perform actions with INTEGRATIONS
            }

            if (prop.runs.length > 0){
                console.log("RUNS: ", prop.runs);
                ////// can perform actions with RUNS
            }
        } else
            console.log("No user so far - ", prop.loggedUser);
        
    }, [prop]);


    return (
        <div className="text-center pt-8">
            <h1>Current user: <span className="text-green-500"> {prop.loggedUser || "Choose a user"}</span></h1>
            <h1>1. CUSTOMERS: System got 
                <span className="text-red-600"> {prop.customers.length} </span> 
                customers in memory - "<span className="text-blue-600"> global customers</span>" </h1>
            <h1>2. INTEGRATIONS: System got
                <span className="text-red-600"> {prop.integrations.length} </span> 
                integrations in memory - "<span className="text-blue-600"> global integrations</span>" </h1>
            <h1>3. RUNS: System got 
                <span className="text-red-600"> {prop.runs.length} </span>
                runs in memory - "<span className="text-blue-600"> global runs</span>" </h1>
        </div>
    )
}
