import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../axios';
import ItemList from '../components/ItemList';
import Loading from '../components/Loading';
import { ApiPath } from '../constants';

const SearchResults = () => {
  const location = useLocation();

  // 商品一覧リストのSTATES
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSearchItemsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const getSearchItemsList = async () => {
    await axios
      .get(ApiPath.SEARCH_ITEM, {
        params: {
          keyword: location.search.replace('?', ''),
        },
      })
      .then(response => {
        const list = [];
        const apiData = response.data;
        apiData.forEach(target => {
          const item = {
            id: target.id,
            title: target.title,
            description: target.description,
            price: target.price,
          };
          list.push(item);
        });
        setItemList(list);
        setIsLoading(false);
      })
      .catch(error => {});
  };

  return (
    <div>{isLoading ? <Loading /> : <ItemList itemList={itemList} />}</div>
  );
};

export default SearchResults;
