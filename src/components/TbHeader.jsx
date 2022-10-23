import { AppBar, Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import history from '../history';
import React from 'react';

/**
 * ヘッダーコンポーネント
 *
 * @returns jsx
 */
const TbHeader = styles => {

  const headerStyle = {
    fontWeight: '900',
    fontSize: `${styles.styles.sidebarCollapsed ? 10 : 20}px`,
    letterSpacing: '0.4em',
    cursor: 'pointer',
  };

  // トップ画面に変遷
  const toTop = () => {
    history.push('/');
  };

  // マスター商品画面に変遷
  const linkIm = () => {
    const url = `/`;
    history.push(url);
  };

  // TV画面に変遷
  const linkTv = () => {
    const url = `/tv/`;
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
          <p style={headerStyle} onClick={toTop}>ジャニ！タブレット</p>
          <p>Env:{process.env.NODE_ENV}</p>
      </div>
      <div>
        <Button className="button-pink header-im" onClick={linkIm}>IM</Button>
        <Button className="button-pink header-tv" onClick={linkTv}>TV</Button>
        <Button className="button-pink" onClick={linkTw}>Twitter</Button>
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

export default TbHeader;
