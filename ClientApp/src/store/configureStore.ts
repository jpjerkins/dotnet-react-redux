import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { ApplicationState, reducers } from './';
import createSagaMiddleware from 'redux-saga';
import weatherForecastSaga from '../sagas/WeatherForecastSaga';

const initializeSagaMiddleware = createSagaMiddleware();

declare global {
    interface Window { store: any; }
}

export default function configureStore(history: History, initialState?: ApplicationState) {
    const middleware = [
        initializeSagaMiddleware,
        routerMiddleware(history)
    ];

    const rootReducer = combineReducers({
        ...reducers,
        router: connectRouter(history)
    });

    const enhancers = [];
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
    }

    var store = createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware), ...enhancers)
    );

    initializeSagaMiddleware.run(weatherForecastSaga);

    window.store = store;
    return store;
}
