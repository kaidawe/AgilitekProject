import { useState, useEffect } from 'react';
import './App.css';

function App() {

  useEffect(() => {
    document.title = "Agilitek"
  }, []);

  return (
    <div className="text-4xl text-stone-700 text-center">
      <h1>Hello World</h1>
    </div>
  )
}

export default App;
