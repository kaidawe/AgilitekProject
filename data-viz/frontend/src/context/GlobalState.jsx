
// INFORMATION TO BE REPLACED IF WE CHOSE TO USE THIS


import React, { createContext, useReducer, useEffect } from "react";
import AppReducer from "./AppReducer";

// initial state
const initialState = {
  watchlist: localStorage.getItem("watchlist") ? JSON.parse(localStorage.getItem("watchlist")) : [],
  favourites: localStorage.getItem("favourites") ? JSON.parse(localStorage.getItem("favourites")) : [],
};


// create context & export
export const GlobalContext = createContext(initialState);

// building a provider
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  

  //triggered whenever a item is changed in the provider
  useEffect(() => {
    
    // when triggered save to localstorage - has to be a string
    localStorage.setItem("watchlist", JSON.stringify(state.watchlist));
    localStorage.setItem("favourites", JSON.stringify(state.favourites));
  }, [state]);



  // actions
  // This goes into the App Reducer and excecutes the function depending on the case
  const addMovieToWatchlist = (movie) => {
    dispatch({ type: "ADD_MOVIE_TO_WATCHLIST", payload: movie });
  };
 
  //Only need the ID to figure out what movie to remove
  const removeMovieFromWatchlist = (id) => {
    dispatch({ type: "REMOVE_MOVIE_FROM_WATCHLIST", payload: id });
  };

  const addMovieToFav = (movie) => {
    dispatch({ type: "ADD_MOVIE_TO_FAV", payload: movie });
  };

  const moveToWatchlist = (movie) => {
    dispatch({ type: "MOVE_TO_WATCHLIST", payload: movie });
  };

  const removeFromFav = (id) => {
    dispatch({ type: "REMOVE_FROM_FAV", payload: id });
  };


  //values that are available from the provider
  return (
    <GlobalContext.Provider
      value={{
        watchlist: state.watchlist,
        favourites: state.favourites,
        addMovieToWatchlist,
        removeMovieFromWatchlist,
        addMovieToFav,
        moveToWatchlist,
        removeFromFav,
      }}>

      {props.children}
    </GlobalContext.Provider>
  );
};