import { Box } from '@material-ui/core';
import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
import { useHistory } from 'react-router-dom';

/**
 *　商品１件を表示するコンポーネント
 *
 * @param {object} item
 * @returns jsx
 */
const Item = ({ item }) => {
  const history = useHistory();
  const moment = require("moment");
  const date = moment(item.pubDate).format('YYYY-MM-DD');

  const nl2br = require('react-nl2br');

  // 編集ページに変遷
  const detailItem = () => history.push(`/edit/${item.id}`);

  const upStatus = (res) => {
    console.log(res);
  }

  const upBlog = async (item) => {
    await axios
      // .post(ApiPath.ITEMS, item)
      .get(ApiPath.IM + 'blog/' + item.id)
      .then(response => {
        console.log(response);
        upStatus(response.body);
        // history.push('/');
        // clearItemStates();
      })
      .catch(error => {});
  };

  return (
    <div className="itemContainer" onClick={detailItem}>
      <Text>
        <ul>
          <li>{date}</li>
          {/* <li>{item.id}</li> */}
          <li className="textBoxTitle">
            <p>
              <b>{item.title}</b>
            </p>
          </li>
          <li className="textBox">
            <p>{nl2br(item.description)}</p>
          </li>
          <li className="price">
            <p>
              <b>{item.price}</b>&nbsp;yen
            </p>
          </li>
          <li><Btn onClick={upBlog}>Blog更新</Btn></li>
        </ul>
      </Text>
    </div>
  );
};

/**
 * UI(文章系をまとめるBOX)
 *
 */
const Text = styled(Box)({
  padding: '10px',
});

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  margin: '10px 0',
  color: 'white',
});

export default Item;
