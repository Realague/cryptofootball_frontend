import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import {Provider} from "react-redux";
import {persistor, store} from "./store/configureStore";
import {ThemeProvider} from "@emotion/react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Collection from "./components/mainPages/Collection";
import Marketplace from "./components/mainPages/Marketplace";
import {PersistGate} from 'redux-persist/lib/integration/react';
import theme from "./theme";
import {CssBaseline} from "@mui/material";
import {createContext} from "istanbul-lib-report";

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App/>}>
                            <Route path="/collection" element={<Collection/>}/>
                            <Route path="/marketplace" element={<Marketplace/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </PersistGate>
    </Provider>,
    document.getElementById("root"),
);
