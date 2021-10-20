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
  // TV一覧リストのSTATES
  const [tvList, setTvList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // const imList = getAllItems();
    // const tvList = getAllTv();
    // const data = {
    //   'imList': imList,
    //   'tvList': tvList,
    // }
    getAllItems();
    getAllTv();
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
          };
          list.push(item);
        });
        setItemList(list);
        console.log(itemList);
        // setIsLoading(false);
      })
      .catch(error => {console.log("IM koko")});
  };

  // TV全件取得
  const getAllTv = async () => {
    const list = [];
    await axios
      .get(ApiPath.TV)
      .then(response => {
        const apiData = response.data;
        console.log(response);
        apiData.forEach(targetItem => {
          const program = {
            id: targetItem.program_id,
            title: targetItem.title,
            description: targetItem.description,
            price: targetItem.on_air_date,
          };
          list.push(program);
        });
        setTvList(list);
        console.log(tvList);
        // setIsLoading(false);
      })
      .catch(error => {console.log("TV koko")});
  };

  return (
    <div>
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <ItemList itemList={itemList} tvList={tvList} />
      )}
    </div>
  );
};

export default All;
