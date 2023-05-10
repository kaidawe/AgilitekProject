import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState.jsx";
import { oneRunAPI } from "../globals/globals.jsx";
import axios from "axios";
import { Link } from "react-router-dom";


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
            try {
                const { data } = await axios({
                    url,
                    // params: {
                    //     integrationId: encodeURIComponent("INTEGRATION#01GVECEZFXDT3YF4VC9K5RFSGW"),
                    //     runId: encodeURIComponent("RUN#1679526075")
                    // },
                    ////
                    // need to pass the integration id AND the run id to execute the query for one run
                    ////
                    params: {
                        integrationId: encodeURIComponent("INTEGRATION#01G2AQ9H975ZJ54YHQDTC74J5X"),
                        runId: encodeURIComponent("RUN#1652533240")
                    },
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

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

            <div className="mt-5 text-blue-700 font-bold" >
                { prop.runs.length === 0 && <p>(WAIT for runs to be loaded)</p> }
                <Link
                    to={`/rundetails/${encodeURIComponent("RUN#1668466829")}`}
                >
                    Run Details - success example click here
                </Link>
            </div>
            <div className="mt-2 text-red-600 font-bold" >
                { prop.runs.length === 0 && <p>(WAIT for runs to be loaded)</p> }
                <Link
                    to={`/rundetails/${encodeURIComponent("RUN#1668250804")}`}
                >
                    Run Details - failed example click here
                </Link>
            </div>
        </div>
    )
}
