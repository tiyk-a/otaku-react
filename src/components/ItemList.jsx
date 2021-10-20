import React from 'react';
import Item from '../components/Item';
import Program from '../components/Program';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const ItemList = ({itemList, tvList}) => {
  console.log(itemList[0]);
  return (
    <div className="allItemsList">
      {itemList !== undefined && itemList.length > 0 ? (
        itemList.map((e, index) => (
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
      {tvList !== undefined && tvList.length > 0 ? (
        tvList.map((e, index) => (
          <div className="itemBox" key={index}>
            <p>{e.title}</p>
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

export default ItemList;
