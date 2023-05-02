import React from 'react';

const IntegrationDetails = ({ integration }) => {

    
      
 
  

  return (

    <div>
    
  {integration &&
    <div className="bg-gray-200 rounded-lg p-4 m-4">
      <h2 className="text-2xl text-sky-500 mb-2 underline text-gray-800">
      <span className="text-sky-500">&rarr;</span>
 Integration Details</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className=" bg-white p-2 rounded-lg">
          <strong className="text-gray-800">Integration Name: </strong> {integration.integration_name}
        </div>
        <div className="bg-white p-2 rounded-lg">

          <strong className="text-gray-800">Data Source: </strong> {integration.data_source}
        </div>
        <div className="bg-white p-2 rounded-lg">
          <strong className="text-gray-800">Data Destination: </strong> {integration.data_destination}
        </div>
        <div className=" bg-white p-2 rounded-lg">
          <strong className="text-gray-800">Run Trigger: </strong> {integration.trigger}
        </div>
      </div>
    </div>
  
  }
    </div>
  );
};

export default IntegrationDetails;
