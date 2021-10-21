import React, { useEffect, useState } from 'react';
import axios from '../axios';
import ItemList from '../components/ItemList';
import Loading from '../components/Loading';
import { ApiPath } from '../constants';

/**
 * 商品全件取得（トップページ）のコンテナ
 *
 */
const All = () => {
  // 商品一覧リストのSTATES
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllItems();
    setIsLoading(false);
  }, []);

  // 商品全件取得
  const getAllItems = async () => {
    const list = [];
    await axios
      .get(ApiPath.IM + '?page=10')
      .then(response => {
        const apiData = response.data;
        apiData.forEach(targetItem => {
          const item = {
            id: targetItem.item_m_id,
            title: targetItem.title,
            description: targetItem.item_caption,
            price: targetItem.price,
            pubDate: targetItem.publication_date,
          };
          list.push(item);
        });
        setItemList(list);
        console.log(itemList);
      })
      .catch(error => {console.log("IM koko")});
  };

  return (
    <div>
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          <ItemList itemList={itemList} />
        </div>
      )}
    </div>
  );
};

export default All;
