import { Box } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React from 'react';
import { useHistory } from 'react-router-dom';

/**
 *　TV１件を表示するコンポーネント
 *
 * @param {object} program
 * @returns jsx
 */
const Program = ({ program }) => {
  const history = useHistory();
  const moment = require("moment");
  const date = moment(program.date).format('YYYY-MM-DD');

  const nl2br = require('react-nl2br');

  // 編集ページに変遷
  const editTv = () => history.push(`/tv/edit/${program.id}`);

  return (
    <div className="itemContainer" onClick={editTv}>
      <Text>
        <ul>
          <li>{date}</li>
          <li className="textBoxTitle">
            <p>
              <b>{program.title}</b>
            </p>
          </li>
          <li className="textBox">
            <p>{nl2br(program.description)}</p>
          </li>
          <li className="price">
            <p>
              <b>{program.price}</b>
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

export default Program;
