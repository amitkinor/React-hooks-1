import React , { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useHttp from '../hooks/http';
import Card from '../UI/Card';
import './Search.css';
import ErrorModal from '../UI/ErrorModal';
import LoadingIndication from '../UI/LoadingIndicator';

const Search = React.memo(props => {

  const {
		loading,
		data,
		error,
		sendRequest,
		clear,
	} = useHttp();

   const { updateFilterHandler } = props;
   const [enteredFilter, setEntered] = useState('');
   const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(enteredFilter === inputRef.current.value){
        const querry = enteredFilter.length === 0
        ? ''
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
      
        sendRequest(
          'https://react-hooks-cd19d.firebaseio.com//ingredients.json' + querry,
          'GET');
      }    
    }, 500);
    return () => {
      clearTimeout(timer);
    };
    
  },[enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!loading && !error && data){
      const loadedIngredients = [];
        for (const key in data) {
          loadedIngredients.push({
            id: key,
            title: data[key].title,
            amount: data[key].amount,
          });
        }
      updateFilterHandler(loadedIngredients);
    }
  },[data, error, loading, updateFilterHandler] )

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}> {error} </ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <span> Loading... </span>}
          <input ref={inputRef} type="text" value={enteredFilter} onChange={(event) => setEntered(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

Search.propTypes = {
  //ingredients: PropTypes.array.isRequired,
  updateFilterHandler: PropTypes.func.isRequired,
}

export default Search;