import React from 'react';
import Item from '../components/Item';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const ItemList = ({itemList, teamId}) => {
  console.log(itemList);
  console.log(teamId);
  return (
    <div className="allItemsList">
      {itemList !== undefined && itemList.length > 0 ? (
        itemList.map((e, index) => (
          <div className="itemBox" key={index}>
            <Item item={e} teamId={teamId} />
          </div>
        ))
      ) : (
        <div>
          <h1>IMデータが見つかりませんでした:(</h1>
          <a href="/new">新しく商品を登録する？</a>
        </div>
      )}
    </div>
  );
};

export default ItemList;
