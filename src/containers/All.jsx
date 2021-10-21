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
    // const imList = getAllItems();
    // const tvList = getAllTv();
    // const data = {
    //   'imList': imList,
    //   'tvList': tvList,
    // }
    getAllItems();
    setIsLoading(false);
  }, []);

  // 商品全件取得
  const getAllItems = async () => {
    const list = [];
    await axios
      .get(ApiPath.IM)
      .then(response => {
        const apiData = response.data;
        // console.log(response);
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
        // setIsLoading(false);
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
