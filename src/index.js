import { makeStyles } from '@material-ui/styles';
import React from 'react';
// import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import './assets/styles/index.css';
import history from './history';

/**
 * AppFunction
 */
const AppFunction = () => {
  // スタイルを使う
  const classes = useStyles();

  return (
    // <CookiesProvider>
      <div className={classes.root}>
        <Router history={history}>
          <App />
        </Router>
      </div>
    // </CookiesProvider>
  );
};

/**
 * UI（スタイルの指定）
 */
const useStyles = makeStyles({
  root: {
    padding: '20px 40px',
  },
});

const rootElement = document.getElementById('root');
ReactDOM.render(<AppFunction />, rootElement);
