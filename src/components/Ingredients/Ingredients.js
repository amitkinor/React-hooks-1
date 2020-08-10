import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
//import errModal from '../UI/ErrorModal';
import ErrorModal from "../UI/ErrorModal";


/*
  * commented out all the setState usage after replacing them 
  *  with useReducer
*/

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter( ing => ing.id !== action.id);
    default:
      throw new Error('Sould not gt there!');
  }
}

const httpReducer = (curHttpstate, action) => {
  switch(action.type) {
    case  'SEND':
      return {loading: true, error:null};
    case  'RESPONSE':
      return { ...curHttpstate, loading: false};
    case  'ERROR':
      return {loading: false, error:action.errorData};
      case 'CLEAR_ERROR':
        return {...curHttpstate, error:null};
    default:
      throw new Error('should not be reached!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatchIngs] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer,{loading: false, error:null});
	// const [userIngredients, setUserIngredients] = useState([]);
  // const [loadingState, setLoading] = useState(false);
  // const [error, setError] = useState();

	const addIngredientHandler = useCallback((ingredient) => {
    //setLoading(true);
    dispatchHttp({type:'SEND'});
		fetch("https://react-hooks-cd19d.firebaseio.com/ingredients.json", {
			method: "POST",
			body: JSON.stringify(ingredient),
			headers: { "Content-Type": "application/json" },
		})
		.then((response) => {
      //setLoading(false);
      dispatchHttp({type:'RESPONSE'});
			return response.json();
		})
		.then((responseData) => {
			// setUserIngredients((prevIngredients) => [
			// 	...prevIngredients,
			// 	{ id: responseData.name, ...ingredient }
      // ]);
      dispatchIngs({type:'ADD', ingredient: { id: responseData.name, ...ingredient }})
		});
	},[]);

	useEffect(() => console.log("rendering ingredients", userIngredients), [
		userIngredients,
	]);

	const removeItemHandler = useCallback((id) => {
    //setLoading(true);
    dispatchHttp({type:'SEND'});
		fetch(`https://react-hooks-cd19d.firebaseio.com//ingredients/${id}.jsn`, {
			method: "DELETE"
    })
    .then((responseData) => {
			dispatchHttp({type:'RESPONSE'});
			// setUserIngredients((prevIngredients) =>
			// 	prevIngredients.filter((ing) => ing.id !== id)
      // );
      dispatchIngs({type:'DELETE',id:id});
    })
    .catch(err => {
      //setError(err.message);
      //setLoading(false);
      dispatchHttp({type:'ERROR', errorData:'something'});
      //console.log(`this is the error: ${err}`);
    });
	},[]);

	const ingsUpdateFilterHandler = useCallback((filteredIngs) => {
    //setUserIngredients(filteredIngs);
    dispatchIngs({type: 'SET', ingredients: filteredIngs})
	}, []);

  const clearError = () => {
    //setError(null);
    dispatchHttp({type:'CLEAR_ERROR'});
  }

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
				ingredients={userIngredients}
				onRemoveItem={removeItemHandler}
			/>
    )
  }, [userIngredients, removeItemHandler]);

  return (
		<div className="App">
      {httpState.error && 
        (<ErrorModal onClose={clearError}> {httpState.error} </ErrorModal>)
      }
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading} />
			<section>
				<Search updateFilterHandler={ingsUpdateFilterHandler} />
				{ingredientList}
			</section>
		</div>
	);
};

export default Ingredients;
