import React, { useEffect, useState } from 'react';
import axios from '../axios';
import Loading from '../components/Loading';
import TvList from '../components/TvList';
import { ApiPath } from '../constants';

/**
 * 商品全件取得（トップページ）のコンテナ
 *
 */
const All = () => {
  // TV一覧リストのSTATES
  const [tvList, setTvList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllTv();
    setIsLoading(false);
  }, []);

  // TV全件取得
  const getAllTv = async () => {
    const list = [];
    await axios
      .get(ApiPath.TV + '?page=15')
      .then(response => {
        const apiData = response.data;
        console.log(response);
        apiData.forEach(targetItem => {
          const program = {
            id: targetItem.program_id,
            title: targetItem.title,
            description: targetItem.description,
            date: targetItem.on_air_date,
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
        <div>
          <TvList tvList={tvList} />
        </div>
      )}
    </div>
  );
};

export default All;
