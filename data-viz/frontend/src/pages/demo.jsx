import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState.jsx";
import { oneRunAPI } from "../globals/globals.jsx";
import axios from "axios";


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

            if (Object.keys(prop.integrationsByCustomer).length > 0){
                console.log("INTEGRSTIONS BY CUSTOMERS: ", prop.integrationsByCustomer);
                ////// can perform actions with RUNSBYCUSTOMER object
            }

            if (Object.keys(prop.runsByIntegration).length > 0){
                console.log("RUNS BY INTEGRSTIONS: ", prop.runsByIntegration);
                ////// can perform actions with RUNSBYINTEGRATIONS object
            }

        } else
            console.log("No user so far - ", prop.loggedUser);
        
    }, [prop]);


    useEffect(() => {
        const url = oneRunAPI;
        const getOnRun = async () => {
            const t1 = Date.now(); // temp
            console.log("----- NOW1: " + Date(t1)); // temp
            try {
                const { data } = await axios({
                    url,
                    params: {
                        integrationId: encodeURIComponent("INTEGRATION#01GVECEZFXDT3YF4VC9K5RFSGW"),
                        runId: encodeURIComponent("RUN#1679526075")
                    },
                    ////
                    // need to pass the integration id AND the run id to execute the query for one run
                    ////
                    // params: {
                    //     integrationId: encodeURIComponent("INTEGRATION#01G2AQ9H975ZJ54YHQDTC74J5X"),
                    //     runId: encodeURIComponent("RUN#1652533240")
                    // },
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // it grabs info from the last object in the setp_history array
                const stepStatus = data[data.length - 1].step_status;
                const lastMessage = data[data.length - 1].completed_step;
                
                const t2 = Date.now(); // temp
                console.log("----- NOW2: " + Date(t2)); // temp
                console.log("------- TOTAL TIME: " + ((t2 - t1) / 1000) + " seconds"); // temp

                console.log("stepStatus::: ", stepStatus);
                console.log("lastMessage::: ", lastMessage);
                console.log("step_history from the run::: ", data);
                return data;
            } catch (error) {
                const errorMessage = error.message || error || "Problem getting customers";
                console.log(`###ERROR: ${errorMessage}`);
                return { message: errorMessage };
            }
        }

        getOnRun();
    }, []);


    return (
        <div className="text-center pt-8">
            <h1>Current user: <span className="text-green-500"> {prop.loggedUser || "Choose a user"}</span></h1>
            <h1>1. CUSTOMERS: System got 
                <span className="text-red-600"> {prop.customers.length} </span> 
                customers in memory* - "<span className="text-blue-600">customers</span>"** </h1>
            <h1>2. INTEGRATIONS: System got
                <span className="text-red-600"> {prop.integrations.length} </span> 
                integrations in memory* - "<span className="text-blue-600">integrations</span>"** </h1>
            <h1>3. RUNS: System got 
                <span className="text-red-600"> {prop.runs.length} </span>
                runs in memory* - "<span className="text-blue-600">runs</span>"** </h1>

            <p>* same data in Database</p>
            <p>** property name in globals</p>
        </div>
    )
}
