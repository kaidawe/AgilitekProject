
// telling our program what to do with the data
// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
  
      case "ADD_MOVIE_TO_WATCHLIST":
        return { ...state, watchlist: [action.payload, ...state.watchlist],
        }; //adds the movie to existing watchlist using spread
  
      case "REMOVE_MOVIE_FROM_WATCHLIST":
        return {...state, watchlist: state.watchlist.filter(
            (movie) => movie.id !== action.payload
          ),
        };
  
      case "ADD_MOVIE_TO_FAV":
        return {
          ...state,
          watchlist: state.watchlist.filter(
            (movie) => movie.id !== action.payload.id
          ),
          favourites: [action.payload, ...state.favourites],
        };
  
      case "MOVE_TO_WATCHLIST":
        return {
          ...state,
          favourites: state.favourites.filter(
            (movie) => movie.id !== action.payload.id
          ),
          watchlist: [action.payload, ...state.watchlist],
        };
  
      case "REMOVE_FROM_FAV":
        return {
          ...state,
          favourites: state.favourites.filter((movie) => movie.id !== action.payload),
        };
  
      default:
        return state;
    }
  };