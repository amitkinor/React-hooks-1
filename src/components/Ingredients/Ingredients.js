import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = ingredient => {
    fetch(
      'https://react-hooks-cd19d.firebaseio.com//ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: {'Content-Type': 'application/json'}
      })
      .then((response) => response.json())
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ])
      })
  }   ;

  useEffect(() => console.log('rendering ingredients', userIngredients),
    [userIngredients]);

  const removeItemHandler = (id) => {
    fetch(
      `https://react-hooks-cd19d.firebaseio.com//ingredients/${id}.json`,
      {
        method: 'DELETE',
        
      })
      .then(responseData => {
        setUserIngredients((prevIngredients) => 
        prevIngredients.filter( ing => ing.id !== id)
        )
      });
  };

  const ingsUpdateFilterHandler = 
    useCallback(  
      ((filteredIngs) => {
        setUserIngredients(filteredIngs);
      })
    ,[]);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search updateFilterHandler={ingsUpdateFilterHandler}/>
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeItemHandler} />
      </section>
    </div>
  );
};

export default Ingredients;
