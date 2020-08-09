import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Card from '../UI/Card';
import LoadingIndication from '../UI/LoadingIndicator';
import './IngredientForm.css';


const IngredientForm = React.memo(props => {
  const { loading } = props;
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({ title: enteredTitle, amount: enteredAmount });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={enteredTitle}
              onChange={event => {
                setEnteredTitle(event.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={enteredAmount}
              onChange={event => {
                setEnteredAmount(event.target.value);
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {loading && <LoadingIndication />}
          </div>
        </form>
      </Card>
    </section>
  );
});

IngredientForm.propTypes = {
  loading:PropTypes.bool.isRequired,
  onAddIngredient: PropTypes.func.isRequired
}

export default IngredientForm;
