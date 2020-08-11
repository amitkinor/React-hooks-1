import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../hooks/http";

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case "SET":
			return action.ingredients;
		case "ADD":
			return [...currentIngredients, action.ingredient];
		case "DELETE":
			return currentIngredients.filter((ing) => ing.id !== action.id);
		default:
			throw new Error("Sould not gt there!");
	}
};

const Ingredients = () => {
	const [userIngredients, dispatchIngs] = useReducer(ingredientReducer, []);
	const { loading, data, error, sendRequest, reqExtra, reqIdentifier} = useHttp();

	const addIngredientHandler = useCallback((ingredient) => {
    sendRequest(
      'https://react-hooks-cd19d.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT');
	}, [sendRequest]);

  useEffect(() => {
    if(!loading && !error && reqIdentifier === 'REMOVE_INGREDIENT'){
      dispatchIngs({type:'DELETE', id:reqExtra})
    } else if (!loading && !error && reqIdentifier === 'ADD_INGREDIENT'){
      dispatchIngs({type:'ADD', ingredient: { id: data.name, ...reqExtra }})
    }}
    ,
   [data, reqExtra,reqIdentifier, loading, error ]);

	const removeItemHandler = useCallback(
		(id) => {
			sendRequest(
				`https://react-hooks-cd19d.firebaseio.com/ingredients/${id}.json`,
        "DELETE",
        null,
        id,
        'REMOVE_INGREDIENT'
			);
		},
		[sendRequest]
	);

	const ingsUpdateFilterHandler = useCallback((filteredIngs) => {
		//setUserIngredients(filteredIngs);
		dispatchIngs({ type: "SET", ingredients: filteredIngs });
	}, []);

	const clearError = () => {
		//setError(null);
		//dispatchHttp({ type: "CLEAR_ERROR" });
	};

	const ingredientList = useMemo(() => {
		return (
			<IngredientList
				ingredients={userIngredients}
				onRemoveItem={removeItemHandler}
			/>
		);
	}, [userIngredients, removeItemHandler]);

	return (
		<div className="App">
			{error && <ErrorModal onClose={clearError}> {error} </ErrorModal>}
			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={loading}
			/>
			<section>
				<Search updateFilterHandler={ingsUpdateFilterHandler} />
				{ingredientList}
			</section>
		</div>
	);
};

export default Ingredients;
