import { AppBar } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import styled from '@material-ui/styles/styled';
import React from 'react';
// import Login from '../containers/Login';
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
  };

  // トップ画面に変遷
  const toTop = () => {
    history.push('/');
  };

  // 新規商品作成画面に変遷
  const toNew = () => {
    history.push('/new');
  };

  return (
    <HeaderBar>
      <div className="flexRowCenter">
        <NewItemIcon onClick={toNew} />
        <a onClick={toTop}>
          <p style={headerStyle}>MERCHANDISE RETRIEVAL SYSTEM</p>
        </a>
      </div>
      <div className="flexRowCenter" style={headerStyle}>
        <Search />
        {/* <Login /> */}
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
  // background: '#000000',
  background: '#9796f0',  /* fallback for old browsers */
  background: '-webkit-linear-gradient(to right, #fbc7d4, #9796f0)',  /* Chrome 10-25, Safari 5.1-6 */
  background: 'linear-gradient(to right, #fbc7d4, #9796f0)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
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

export default Header;
