import { Box } from '@material-ui/core';
import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';

import { useHistory } from 'react-router-dom';

/**
 *　TV１件を表示するコンポーネント
 *
 * @param {object} program
 * @returns jsx
 */
const Program = ({ program, teamId }) => {
  const history = useHistory();
  const moment = require("moment");
  const date = moment(program.date).format('YYYY-MM-DD');

  const nl2br = require('react-nl2br');

  // 編集ページに変遷
  const editTv = () => history.push(`/tv/edit/${teamId}/${program.id}`);

  const delTv = async () => {
    await axios
      .delete(ApiPath.TV + program.id)
      .then(response => {
        window.location.reload();
      })
      .catch(error => {});
  };

  return (
    <div className="itemContainer">
      <Text>
        <ul>
          <li>{program.id}</li>
          <li>{date}</li>
          <li className="textBoxTitle">
            <p>
              <b>{program.title}</b>
            </p>
          </li>
          <li className="textBox" onClick={editTv}>
            <p>{nl2br(program.description)}</p>
          </li>
          <li className="price">
            <p>
              <b>{program.price}</b>
            </p>
          </li>
          <li>
            <Btn onClick={delTv}>DELETE</Btn>
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

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  margin: '10px 0',
  color: 'white',
});

export default Program;
