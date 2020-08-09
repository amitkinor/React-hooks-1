import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import errModal from '../UI/ErrorModal';
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {
	const [userIngredients, setUserIngredients] = useState([]);
  const [loadingState, setLoading] = useState(false);
  const [error, setError] = useState();

	const addIngredientHandler = (ingredient) => {
		setLoading(true);
		fetch("https://react-hooks-cd19d.firebaseio.com/ingredients.json", {
			method: "POST",
			body: JSON.stringify(ingredient),
			headers: { "Content-Type": "application/json" },
		})
		.then((response) => {
			setLoading(false);
			return response.json();
		})
		.then((responseData) => {
			setUserIngredients((prevIngredients) => [
				...prevIngredients,
				{ id: responseData.name, ...ingredient }
			]);
		});
	};

	useEffect(() => console.log("rendering ingredients", userIngredients), [
		userIngredients,
	]);

	const removeItemHandler = (id) => {
		setLoading(true);
		fetch(`https://react-hooks-cd19d.firebaseio.com//ingredients/${id}.json`, {
			method: "DELETE",
    })
    .then((responseData) => {
			setLoading(false);
			setUserIngredients((prevIngredients) =>
				prevIngredients.filter((ing) => ing.id !== id)
			);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
	};

	const ingsUpdateFilterHandler = useCallback((filteredIngs) => {
		setUserIngredients(filteredIngs);
	}, []);

  const clearError = () => {
    setError(null);
  }

	return (
		<div className="App">
      {error && <ErrorModal onClose={clearError}> {error} </ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={loadingState} />
			<section>
				<Search updateFilterHandler={ingsUpdateFilterHandler} />
				<IngredientList
					ingredients={userIngredients}
					onRemoveItem={removeItemHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
