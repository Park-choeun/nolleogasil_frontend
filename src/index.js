import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
// import ReactDOM from 'react-dom';

//strictmode때문에 render가 2번됨 -> 지도 겹치는 현상 발생


// strictmode version
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

//strictmode제거 version
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <RecoilRoot>
        <App />
    </RecoilRoot>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
