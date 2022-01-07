import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorImage } from '../components/Image';
// import { UserAuth } from '../constants';

/**
 * エラー画面描画のコンポーネント
 *
 */
const Error = styles => {
  const errorStyle = {
    fontWeight: '900',
    fontSize: `${styles.styles.sidebarCollapsed ? 10 : 20}px`,
    letterSpacing: '0.4em',
  };
  const location = useLocation();
  const statusCode = location.state.status.replace(/\D/g, '');

  // const loginFunc = () => {
  //   window.location.assign(UserAuth.PATH);
  // };

  const jumpToNewItem = () => {
    window.location.assign('/new');
  };

  return (
    <div className="flexColumn">
      <h1 className="loadingMsg" style={errorStyle}>
        O O P S ...
      </h1>
      <img src={ErrorImage.path} alt="エラー通知画像" />
      {!location.state ? (
        <div>
          <p>500</p>
          <p>予期せぬエラーが発生しました。。</p>
        </div>
      ) : null}

      {location.state && location.state.message ? (
        <div>
          <p style={errorStyle}>{location.state.message}</p>
          {statusCode === '404' ? (
            <Btn className="focusButton" onClick={jumpToNewItem}>
              Null btn
            </Btn>
          ) : null}
        </div>
      ) : null}
      {/* {statusCode === '401' ? (
        <Btn className="focusButton" onClick={loginFunc}>
          商品情報を閲覧するにはLOGINしてください
        </Btn>
      ) : null} */}
    </div>
  );
};

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  color: 'black',
});

export default Error;
