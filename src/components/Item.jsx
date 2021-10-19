import { Box } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React from 'react';
import { useHistory } from 'react-router-dom';
import NoImage from '../components/NoImage';
import { ApiPath } from '../constants';

/**
 *　商品１件を表示するコンポーネント
 *
 * @param {object} item
 * @returns jsx
 */
const Item = ({ item }) => {
  const history = useHistory();
  console.log("item no naka");
  console.log(item);
  let imageUrl = '';
  // if (item.imagePath) {
  //   imageUrl = `${ApiPath.API_ENDPOINT}${ApiPath.IMAGE}${item.imagePath}`;
  // }

  const nl2br = require('react-nl2br');

  // 商品詳細ページに変遷
  const detailItem = () => history.push(`/detail/${item.id}`);

  return (
    <div className="itemContainer" onClick={detailItem}>
      {item.imagePath ? <img src={imageUrl} alt="商品画像" /> : <NoImage />}
      <Text>
        <ul>
          <li className="textBoxTitle">
            <p>
              <b>ここ{item.title}</b>
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
