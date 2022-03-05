import { Box } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Error from './components/Error';
import Header from './components/Header';
import Tv from './containers/Tv';
import Top from './containers/Top';
import Twitter from './containers/Twitter';

/**
 * ルーティングのみを行うApp.js
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 0,
      windowHeight: 0,
    };

    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    let windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

    this.setState({ windowWidth, windowHeight });
  }

  render() {
    const { windowWidth } = this.state;

    const sidebarCollapsed = windowWidth < 1100;

    const styles = {
      topBarHeight: 40,
      footerMenuHeight: 50,
      showFooterMenuText: windowWidth > 500,
      showSidebar: windowWidth > 768,
      sidebarCollapsed,
      sidebarWidth: sidebarCollapsed ? 50 : 150,
      wideFlag: windowWidth > 1100 ? true : false,
      windowWidth: windowWidth,
    };

    return (
      <AppContainer>
        <Header styles={styles} />
        <Switch>
          <Route exact path="/">
            <Top />
          </Route>
          <Route exact path="/tv">
            <Tv />
          </Route>
          <Route exact path="/tw">
            <Twitter />
          </Route>
          <Route exact path="/error/">
            <Error styles={styles} />
          </Route>
          {/* どれにもマッチしないパスにアクセスされた時 */}
          <Route component={NoMatch} />
        </Switch>
      </AppContainer>
    );
  }
}

/**
 * UI(全体の指定)
 */
const AppContainer = styled(Box)({
  marginTop: '100px',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 30px',
});

/**
 * 404の時
 */
const NoMatch = ({ location }) => (
  <div className="flexRowCenter">
    <h3>
      お探しのページ"<code>{location.pathname}</code>"は見つかりませんでした:(
    </h3>
  </div>
);

export default App;
