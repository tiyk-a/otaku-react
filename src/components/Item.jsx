import { Box } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React from 'react';
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

export default Item;
