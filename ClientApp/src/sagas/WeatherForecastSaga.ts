import { takeEvery, call, put } from 'redux-saga/effects';
import { RequestWeatherForecastsAction, ReceiveWeatherForecastsAction, WeatherForecast } from '../store/WeatherForecasts';

export default function* watcherSaga() {
	yield takeEvery('REQUEST_WEATHER_FORECASTS', workerSaga);
}

function* workerSaga(action: RequestWeatherForecastsAction) {
	try {
		const payload = yield call(getData, action.startDateIndex);
		yield put(payload as ReceiveWeatherForecastsAction)
	} catch (e) {
		yield put({ type: 'API_ERROR', payload: e});
	}
}

function getData(startDateIndex: number): Promise<ReceiveWeatherForecastsAction> {
	return fetch(`weatherforecast`)
			.then(response => response.json() as Promise<WeatherForecast[]>)
			.then(data => ({ type: 'RECEIVE_WEATHER_FORECASTS', startDateIndex: startDateIndex, forecasts: data } as ReceiveWeatherForecastsAction));
}

// requestWeatherForecasts: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
//     // Only load data if it's something we don't already have (and are not already loading)
//     const appState = getState();
//     if (appState && appState.weatherForecasts && startDateIndex !== appState.weatherForecasts.startDateIndex) {
//         fetch(`weatherforecast`)
//             .then(response => response.json() as Promise<WeatherForecast[]>)
//             .then(data => {
//                 dispatch({ type: 'RECEIVE_WEATHER_FORECASTS', startDateIndex: startDateIndex, forecasts: data });
//             });

//         dispatch({ type: 'REQUEST_WEATHER_FORECASTS', startDateIndex: startDateIndex });
//     }
// }
