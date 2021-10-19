import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';
import Item from '../components/Item';
import Loading from '../components/Loading';
import { ApiPath } from '../constants';
import history from '../history';

/**
 * 商品詳細取得（商品詳細ページ）のコンテナ
 *
 */
const Detail = () => {
  // 商品１件のSTATE
  const [item, setItem] = useState({
    id: undefined,
    title: '',
    description: '',
    price: 0,
    imagePath: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // 商品のid
  const { id } = useParams();

  useEffect(() => {
    getItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 商品１件取得
  const getItem = () => {
    console.log(id);
    axios
      .get("/posts?id=" + id)
      .then(response => {
        const item = response.data[0];
        setItem({
          id: id,
          title: item.title,
          description: item.item_caption,
          price: item.price,
          imagePath: item.url,
        });
        setIsLoading(false);
        console.log(item);
      })
      .catch(error => {});
  };

  // 商品編集画面に変遷
  const editItem = () => {
    const url = `/edit/${id}`;
    history.push(url);
  };

  // 商品削除
  const removeItem = () => {
    axios
      .delete(ApiPath.ITEM.replace('$id', id))
      .then(response => {
        history.push('/');
      })
      .catch(error => {});
  };

  return (
    <div className="detailElement">
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          <p>{item.title}</p>
          <Item item={item} />
          <div className="flexRowCenter">
            <Btn onClick={removeItem}>削除</Btn>
            <Btn onClick={editItem}>編集</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  margin: '10px 0',
  color: 'white',
});

export default Detail;
