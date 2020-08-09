import React , { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';


import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

   const { updateFilterHandler } = props;
   const [enteredFilter, setEntered] = useState('');
   const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(enteredFilter === inputRef.current.value){
        const querry = enteredFilter.length === 0
        ? ''
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
      fetch('https://react-hooks-cd19d.firebaseio.com//ingredients.json' + querry)
        .then((response) => response.json())
        .then(responseData => {
          const loadedIngredients = [];
          for (const key in responseData) {
            loadedIngredients.push({
              id: key,
              title: responseData[key].title,
              amount: responseData[key].amount,
            });
          }
         updateFilterHandler(loadedIngredients);
        }); 
      }    
    }, 500);
    return () => {
      clearTimeout(timer);
    };
    
  },[enteredFilter, updateFilterHandler, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
