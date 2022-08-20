import { AppBar, Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import history from '../history';
import React, { useState } from 'react';

/**
 * ヘッダーコンポーネント
 *
 * @returns jsx
 */
const SpHeader = styles => {
  const [menuFlg, setMenuFlg] = useState(false);

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

  // ハンバーガーメニューをハンドルする
  const toggleMenu = () => {
    if (menuFlg) {
      setMenuFlg(false);
    } else {
      setMenuFlg(true);
    }
  }

  return (
    <HeaderBar>
      <div className="">
          <p style={headerStyle} onClick={toTop}>ジャニ！SPサイト</p>
          <p>Env:{process.env.NODE_ENV}</p>
      </div>
      <div id="outer-container-header">
        <div class="hamburger-menu" onClick={toggleMenu}>
            {menuFlg ? (
              ""
            ) : (
              <label for="menu-btn-check" class="menu-btn-header" onClick={toggleMenu}>
                <span></span>
              </label>
            )}
            {menuFlg ? (
              <div>
                <label for="menu-btn-check" class="menu-btn-header-hover" onClick={toggleMenu}>
                  <span></span>
                </label>
                <div class="menu-content">
                    <Button className="button-pink" onClick={linkIm}>IM</Button>
                    <Button className="button-pink" onClick={linkTv}>TV</Button>
                    <Button className="button-pink" onClick={linkTw}>Twitter</Button>
                </div>
              </div>
            ) : ("") }
        </div>
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

export default SpHeader;
