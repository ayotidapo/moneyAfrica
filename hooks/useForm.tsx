/* eslint-disable react-hooks/exhaustive-deps */

import inputReducer from 'useReducers/inputReducers';
import { useReducer, useEffect } from 'react';
import { IState } from 'useReducers/inputReducers';
import { ValidateInput } from 'helpers';

const useForm = (fields: IState) => {
  const [inputs, inputDispatch] = useReducer(inputReducer, fields);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    inputDispatch({
      type: 'ON_INPUT_CHANGE',
      name,
      value,
    });
  };

  const onBlurInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const field = inputs[name];
    const validatedInputs = ValidateInput(field, inputs);
    inputDispatch({
      type: 'ON_UPDATE_INPUTS',
      validatedInputs,
    });
  };

  const setInputs = (newInputs: IState) => {

    inputDispatch({
      type: 'ON_UPDATE_INPUTS',
      validatedInputs: newInputs,
    });
  };



  return { onChangeInput, onBlurInput, setInputs, inputs };
};

export default useForm;
