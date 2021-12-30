import { AppBar } from '@material-ui/core';
import { Button } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import styled from '@material-ui/styles/styled';
import React from 'react';
import Search from '../containers/Search';
import history from '../history';

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

  // トップ画面に変遷
  const toTop = () => {
    history.push('/');
  };

  // 新規商品作成画面に変遷
  const toNew = () => {
    history.push('/new');
  };

  const linkItem = () => {
    const url = `/item`;
    history.push(url);
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

  // マスター商品画面に変遷
  const linkTeam = () => {
    const url = `/`;
    history.push(url);
  };

  return (
    <HeaderBar>
      <div className="flexRowCenter">
        <NewItemIcon onClick={toNew} />
          <p style={headerStyle} onClick={toTop}>フロント</p>
          <p>Env:{process.env.NODE_ENV}</p>
      </div>
      <div>
        <Btn onClick={linkTeam}>IM</Btn>
        <Btn onClick={linkItem}>Item</Btn>
        <Btn onClick={linkTv}>TV</Btn>
        <Btn onClick={linkTw}>Twitter</Btn>
        <Btn onClick={linkIm}>マスター商品</Btn>
      </div>
      <div className="flexRowCenter" style={headerStyle}>
        <Search />
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
  background: '#9796f0',  /* fallback for old browsers */
  opacity: '0.9',
  height: '100px',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 30px',
  position: 'absolute',
});

const NewItemIcon = styled(CreateIcon)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px 0 5px',
  cursor: 'pointer',
  '&:hover': {
    opacity: '0.5',
    transition: 'opacity 0.5s',
  },
});

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  margin: '10px 0',
  color: 'black',
});

export default Header;
