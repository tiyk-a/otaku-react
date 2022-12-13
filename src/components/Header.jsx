import { AppBar, Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React from 'react';
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

  /**
   * マスター商品画面に変遷
   */
  const linkIm = () => {
    const url = `/?teamId=17`;
    history.push(url);
  };

  /**
   * TV画面に変遷
   */
  const linkTv = () => {
    const url = `/tv?teamId=17`;
    history.push(url);
  };

  /**
   * マスター商品画面に変遷
   */
  const linkTw = () => {
    const url = `/tw/`;
    history.push(url);
  };

  /**
   * 楽天ROOM画面に変遷
   */
  const linkRoom = () => {
    const url = `/room/`;
    history.push(url);
  };

  // const getData = () => {
  //   const mysql = require('mysql2');

  //   // create the connection to database
  //   const connection = mysql.createConnection({
  //   host: 'localhost',
  //   user: 'root',
  //   database: 'root'
  //   });

  //   // simple query
  //   connection.query(
  //     'SELECT * FROM `item` WHERE `publication_date` > "2022-04-01"',
  //     function(err, results, fields) {
  //         // results contains rows returned by server
  //         console.log(results);

  //         // fields contains extra meta data about results, if available
  //         console.log(fields);
  //     }
  //   );

  //   // with placeholder
  //   connection.query(
  //     'SELECT * FROM `item` WHERE `publication_date` = ?',
  //     //   ['Page', 45],
  //     ['2022-04-01'],
  //     function(err, results) {
  //         console.log(results);
  //     }
  //   );
  // }

  return (
    <HeaderBar>
      <div className="flexRowCenter ">
          <p style={headerStyle} onClick={linkIm}>ジャニ！</p>
          <p>Env:{process.env.NODE_ENV}</p>
      </div>
      <div>
        <Button className="button-pink header-im" onClick={linkIm}>IM</Button>
        <Button className="button-pink header-tv" onClick={linkTv}>TV</Button>
        <Button className="button-pink" onClick={linkTw}>Twitter</Button>
        <Button className="button-pink" onClick={linkRoom}>ROOM</Button>
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

export default Header;
