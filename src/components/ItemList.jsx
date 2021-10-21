import React from 'react';
import Item from '../components/Item';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const ItemList = (itemList) => {
  console.log(itemList);
  return (
    <div className="allItemsList">
      <h2>ItemMaster</h2>
      {itemList.itemList !== undefined && itemList.itemList.length > 0 ? (
        itemList.itemList.map((e, index) => (
          <div className="itemBox" key={index}>
            <Item item={e} />
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
