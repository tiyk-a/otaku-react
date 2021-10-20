import { Box } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ApiPath } from '../constants';

/**
 *　TV１件を表示するコンポーネント
 *
 * @param {object} program
 * @returns jsx
 */
const Program = ({ program }) => {
  const history = useHistory();

  const nl2br = require('react-nl2br');

  // 編集ページに変遷
  const detailItem = () => history.push(`/edit/${program.id}`);

  return (
    <div className="itemContainer" onClick={detailItem}>
      <Text>
        <ul>
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
              <b>{program.on_air_date}</b>
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
