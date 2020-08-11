import { useReducer, useCallback } from "react";

const httpReducer = (curHttpstate, action) => {
	switch (action.type) {
		case "SEND":
			return { loading: true, error: null, data: null, extra: null, identifier: action.identifier };
		case "RESPONSE":
			return { ...curHttpstate, loading: false, data: action.responseData, extra:action.extra };
		case "ERROR":
			return { loading: false, error: action.errorData };
		case "CLEAR_ERROR":
			return { ...curHttpstate, error: null };
		default:
			throw new Error("should not be reached!");
	}
};

const useHttp = () => {
	const [httpState, dispatchHttp] = useReducer(httpReducer, {
		loading: false,
		error: null,
    data: null,
    extra:null,
    identifier: null
	});

	const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
		dispatchHttp({ type: "SEND", identifier: reqIdentifier });
		fetch(url, {
			method: method,
			body: body,
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((responseData) => {
				dispatchHttp({ type: "RESPONSE", responseData: responseData, extra:reqExtra });
			})
			.catch((err) => {
				dispatchHttp({ type: "ERROR", errorData: "something" });
			});
	}, []);

	return {
		loading: httpState.loading,
		data: httpState.data,
		error: httpState.error,
		sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier
	};
};

export default useHttp;
