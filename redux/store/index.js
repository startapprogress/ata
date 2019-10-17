import { createStore,compose,applyMiddleware } from 'redux';
import Reactotron from './../../ReactotronConfig'
import { persistStore, persistReducer } from 'redux-persist';
import storage from "./storage.js"//'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { createLogger } from "redux-logger";
import rootReducer from './../reducers';

const persistConfig = {
  // timeout: 30000,
  key: 'root',
  storage,
  whitelist: ["configs","tempState"],
  // whitelist: ["configs"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middleware = [ thunk ];
middleware.push(createLogger());

export default () => {
  let store = createStore(
        persistedReducer,
        // rootReducer,
        undefined,
        compose(
            applyMiddleware(...middleware),
            Reactotron.createEnhancer()
        )
    );
  let persistor = persistStore(store)
  return { store, persistor }
  // return { store }
}
