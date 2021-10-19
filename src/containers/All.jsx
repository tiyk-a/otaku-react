import React, { useEffect, useState } from 'react';
import axios from '../axios';
import ItemList from '../components/ItemList';
import Loading from '../components/Loading';
// import { ApiPath } from '../constants';

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
  }, []);

  // 商品全件取得
  const getAllItems = async () => {
    const list = [];
    await axios
      .get('/posts?from=300&to=320')
      .then(response => {
        const apiData = response.data;
        console.log(response);
        apiData.forEach(targetItem => {
          const item = {
            id: targetItem.item_id,
            title: targetItem.title,
            description: targetItem.item_caption,
            price: targetItem.price,
            imagePath: targetItem.url,
          };
          list.push(item);
        });
        setItemList(list);
        setIsLoading(false);
      })
      .catch(error => {console.log("koko")});
  };

  return (
    <div>
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <ItemList itemList={itemList} />
      )}
    </div>
  );
};

export default All;
