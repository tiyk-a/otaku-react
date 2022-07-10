import { AppBar, Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import history from '../history';
import React from 'react';

/**
 * ヘッダーコンポーネント
 *
 * @returns jsx
 */
const Header = styles => {

  const headerStyle = {
    fontWeight: '900',
    fontSize: `${styles.styles.sidebarCollapsed ? 10 : 20}px`,
    letterSpacing: '0.4em',
    cursor: 'pointer',
  };

  // マスター商品画面に変遷
  const linkIm = () => {
    const url = `/?teamId=17`;
    history.push(url);
  };

  // TV画面に変遷
  const linkTv = () => {
    const url = `/tv?teamId=17`;
    history.push(url);
  };

  // マスター商品画面に変遷
  const linkTw = () => {
    const url = `/tw/`;
    history.push(url);
  };

  return (
    <HeaderBar>
      <div className="flexRowCenter ">
          <p style={headerStyle} onClick={linkIm}>ジャニ！</p>
          <p>Env:{process.env.NODE_ENV}</p>
      </div>
      <div>
        <Btn onClick={linkIm}>IM</Btn>
        <Btn onClick={linkTv}>TV</Btn>
        <Btn onClick={linkTw}>Twitter</Btn>
      </div>
    </HeaderBar>
  );
};

/**
 * ヘッダーバー
 *
 */
const HeaderBar = styled(AppBar)({
  width: '100%',
  background: 'white',
  opacity: '0.9',
  height: '100px',
  flexDirection: 'row',
  justifyContent: 'left',
  alignItems: 'center',
  padding: '12px 30px',
  position: 'absolute',
});

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: '#FFF2F2',
  margin: '10px 0',
  color: 'black',
});

export default Header;
