import React from 'react';
import Program from '../components/Program';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const TvList = ({tvList, teamId}) => {
  return (
    <div className="allItemsList">
      <h2>Program</h2>
      {tvList !== undefined && tvList.length > 0 ? (
        tvList.map((e, index) => (
          <div className="itemBox" key={index}>
            <Program program={e} teamId={teamId} key={e.id} />
          </div>
        ))
      ) : (
        <div>
          <h1>TVデータが見つかりませんでした:(</h1>
        </div>
      )}
    </div>
  );
};

export default TvList;
