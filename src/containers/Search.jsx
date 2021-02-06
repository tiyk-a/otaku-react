import { Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import styled from '@material-ui/styles/styled';
import React, { useState } from 'react';
import history from '../history';
/**
 * キーワードで商品検索
 *
 * @returns 商品リスト
 */
const Search = () => {
  // 検索ワードSTATE
  const [keyword, setKeyword] = useState('');

  // 入力された検索ワードをSTATEに反映
  const handleChangeKeyword = e => {
    const txt = e.target.value;
    setKeyword(txt);
  };

  const searchKeyword = e => {
    if (e.keyCode === 13) {
      history.push(`/search/?${keyword}`);
      setKeyword('');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SearchIconStyled />
      <Input
        type="text"
        name="keyword"
        value={keyword}
        onChange={handleChangeKeyword}
        placeholder="SEARCH"
        onKeyDown={searchKeyword}
      />
    </div>
  );
};

const SearchIconStyled = styled(SearchIcon)({
  padding: '0 5px',
  cursor: 'pointer',
});
export default Search;
