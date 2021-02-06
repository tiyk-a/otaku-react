import CreateIcon from '@material-ui/icons/Create';
import styled from '@material-ui/styles/styled';
import React from 'react';
import history from '../history';

/**
 * リンクのコンポーネント
 *
 */
const Links = () => {
  // 新規商品作成画面に変遷
  const toNew = () => {
    history.push('/new');
  };

  // トップ画面に変遷
  const toTop = () => {
    history.push('/');
  };

  return (
    <div>
      <p onClick={toTop} className="displayFont">
        TOP
      </p>
      <NewItemIcon onClick={toNew} />
    </div>
  );
};

const NewItemIcon = styled(CreateIcon)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 5px',
  cursor: 'pointer',
  '&:hover': {
    opacity: '0.5',
    transition: 'opacity 0.5s',
  },
});

export default Links;
