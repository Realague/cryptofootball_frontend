import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {persistor, store} from './store/configureStore';

import PresentationPage from "./components/presentation/PresentationPage";
import Collection from "./components/mainPages/Collection";
import Marketplace from "./components/mainPages/Marketplace";

function App() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<PresentationPage/>}/>
                        <Route path="/collection" element={<Collection/>}/>
                        <Route path="/marketplace" element={<Marketplace/>}/>
                    </Routes>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
}

export default App;
