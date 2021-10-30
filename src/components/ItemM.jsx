import { Box } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Input } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
import { useHistory } from 'react-router-dom';

/**
 *　商品１件を表示するコンポーネント
 *
 * @param {object} item
 * @returns jsx
 */
const ItemM = ({ item, teamId }) => {
  const history = useHistory();
  const moment = require("moment");
  const date = moment(item.pubDate).format('YYYY-MM-DD');
  const [id, setId] = useState('');
  const [intoId, setIntoId] = useState('');

  useEffect(() => {
    setId(item.id);
  }, [item.id]);

  const nl2br = require('react-nl2br');

  // 編集ページに変遷
  const editItem = () => history.push(`/edit/${teamId}/${item.id}`);

  const upStatus = (res) => {
  }

  const upBlog = async (item) => {
    if (teamId !== undefined) {
      await axios
        .get(ApiPath.IM + 'blog?imId=' + id + '&team=' + teamId, item)
        .then(response => {
          window.location.reload();
        })
        .catch(error => {});
    }
  };

  const delIm = async () => {
    if (teamId !== undefined) {
      await axios
        .delete(ApiPath.IM + id)
        .then(response => {
          upStatus(response.body);
        })
        .catch(error => {});
    }
  };

  // 入力された検索ワードをSTATEに反映
  const handleChangeImId = e => {
    const txt = e.target.value;
    setIntoId(txt);
  };

  const updImId = async (e) => {
    if (e.keyCode === 13) {
      await axios
        .get(ApiPath.IM + 'merge?ord=' + id + '&into=' + intoId)
        .then(response => {
          upStatus(response.body);
        })
        .catch(error => {});
      setIntoId('');
    }
  };

  const postedStyle = {
    // background: "",
  };

  const notPostedStyle = {
    background: "pink",
  };

  return (
    <div className="itemContainer" className={item.wpId !== null && item.wpId !== undefined ? "postedStyle": "notPostedStyle"}>
      <Text>
        <ul>
          <li>{date}</li>
          <li>
            {item.id}
            <br />
            {item.wpId !== null && item.wpId !== undefined ? (item.wpId) : ("No Wp")}
          </li>
          <li className="textBoxTitle">
            <p>
              <b>{item.title}</b>
            </p>
          </li>
          <li className="textBox" onClick={editItem}>
            {/* <p>{nl2br(item.description)}</p> */}
            <p>{item.url}</p>
          </li>
          <li className="price">
            <p>
              <b>{item.price}</b>&nbsp;yen
            </p>
          </li>
          <li>
            <Input
              type="text"
              name="Merge imId"
              value={intoId}
              onChange={handleChangeImId}
              placeholder="imId"
              onKeyDown={updImId}
            />
            <br />
            <Btn onClick={delIm}>DELETE</Btn>
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

export default ItemM;
