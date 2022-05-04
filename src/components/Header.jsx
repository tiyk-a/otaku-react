import { AppBar, Button, TextField } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import history from '../history';
import React, { useState } from 'react';
import { ApiPath } from '../constants';
import axios from '../axios';

/**
 * ヘッダーコンポーネント
 *
 * @returns jsx
 */
const Header = styles => {
  const [sql, setSql] = useState('');
  const [sqlResult, setSqlResult] = useState('');

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

  const handleChangeSql = e => {
    const txt = e.target.value;
    setSql(txt);
  }

  const pushToGetSqlResul = e => {
    if (e.keyCode === 13) {
      getSqlResult();
    }
  }

  // SQLの結果をgetするためにpostします
  const getSqlResult = async () => {
    if (!sql.startsWith("select ")) {
      window.alert("select文以外は打てません❌" + sql);
      return;
    } 
    // TODO:機能ちゃんと動き始めたら以下Else文は削除する。Java未実装
    else {
      return;
    }

    const data = {
      sql: sql
    }
    await axios
      .post(ApiPath.SQL, data)
      .then(response => {
        console.log(response.data);
        setSqlResult(response.data);
      })
      .catch(error => {});
  };

  return (
    <HeaderBar>
      <div className="flexRowCenter ">
          <p style={headerStyle} onClick={toTop}>ジャニ！</p>
          <p>Env:{process.env.NODE_ENV}</p>
      </div>
      <div>
        <Btn onClick={linkIm}>IM</Btn>
        <Btn onClick={linkTv}>TV</Btn>
        <Btn onClick={linkTw}>Twitter</Btn>
      </div>
      <div>
        <TextField
          required
          name="selectSql"
          label="セレクト文"
          value={sql}
          onChange={handleChangeSql}
          rows={2}
          // rowsMax={1}
          onKeyDown={pushToGetSqlResul}
        />
      </div>
      <div>
        <p>SQLデータをどうやって取得するか検討中</p>
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
  background: '#db36a4',
  margin: '10px 0',
  color: 'black',
});

export default Header;
