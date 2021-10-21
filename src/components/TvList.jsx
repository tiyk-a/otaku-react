import React from 'react';
import Program from '../components/Program';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const TvList = (tvList) => {
    console.log(tvList);
  return (
    <div className="allItemsList">
      <h2>Program</h2>
      {tvList !== undefined && tvList.tvList !== undefined && tvList.tvList.length > 0 ? (
        tvList.tvList.map((e, index) => (
          <div className="itemBox" key={index}>
            <Program program={e} />
          </div>
        ))
      ) : (
        <div>
          <h1>TVデータが見つかりませんでした:(</h1>
          <a href="/new">新しく商品を登録する？</a>
        </div>
      )}
    </div>
  );
};

export default TvList;
