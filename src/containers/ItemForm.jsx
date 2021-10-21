import { Button, TextField } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import axios from '../axios';
import { ApiPath } from '../constants';

/**
 * 新規商品登録or商品情報アップデート時のフォーム
 */
const ItemForm = () => {
  // 商品のID
  const { id } = useParams();
  
  const history = useHistory();

  // 【商品データ用のSTATES】
  // 商品タイトルのSTATE
  const [title, setTitle] = useState('');
  // 商品説明文のSTATE
  const [description, setDescription] = useState('');
  // 商品価格のSTATE
  const [price, setPrice] = useState(0);
  // 発売日のSTATE
  const [date, setDate] = useState('');

  const createObjectURL =
    (window.URL || window.webkitURL).createObjectURL || window.createObjectURL;

  useEffect(() => {
    if (id) {
      findData();
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setDate('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 現在のページ
  const location = useLocation();

  useEffect(() => {
    setTitle('');
    setDescription('');
    setPrice('');
    setDate('');
  }, [location]);

  // 各要素が入力されたらSTATEをアップデート
  const handleChange = e => {
    const txt = e.target.value;

    switch (e.target.name) {
      case 'title':
        setTitle(txt);
        break;
      case 'description':
        setDescription(txt);
        break;
      case 'price':
        setPrice(txt);
        break;
      case 'date':
        setDate(txt);
      default:
        break;
    }
  };

  // 商品編集の場合の商品取得
  const findData = () => {
    axios
      .get(ApiPath.IM + id)
      .then(response => {
        console.log(response);
        const item = response.data;
        setTitle(item.title);
        setDescription(item.item_caption);
        setPrice(item.price);
        setDate(item.publication_date);
      })
      .catch(error => {});
  };

  // 新規商品登録のpostを行う
  const axiosItemPost = async (item) => {
    await axios
      // .post(ApiPath.ITEMS, item)
      .post(ApiPath.IM, item)
      .then(response => {
        history.push('/');
        clearItemStates();
      })
      .catch(error => {});
  };

  // 既存商品の更新
  const axiosItemPut = async (item) => {
    await axios
      .put(ApiPath.IM + id, item)
      .then(response => {
        history.push('/');
        clearItemStates();
      })
      .catch(error => {});
  };

  // 全てのItem関連Stateをクリア
  const clearItemStates = () => {
    setTitle('');
    setPrice('');
    setDescription('');
  };

  // 商品追加
  const addItem = async (item) => {
    if (id !== undefined) {
      axiosItemPost(item);
    } else {
      axiosItemPut(item);
    }
  };

  return (
    <div>
      <div className="newItemForm">
        <h2>新規商品登録</h2>
        <p>
          <b>商品名</b>
        </p>
        <TextField
          required
          name="title"
          label="商品名"
          value={title}
          onChange={handleChange}
          fullWidth={true}
        />
        <p>{title.length}</p>
        <br />
        <p>
          <b>商品説明文</b>
        </p>
        <TextField
          required
          name="description"
          label="商品説明文"
          value={description}
          onChange={handleChange}
          fullWidth={true}
          multiline={true}
          rows={3}
          rowsMax={5}
        />
        <p>{description.length}</p>
        <br />
        <p>
          <b>商品価格</b>
        </p>
        <Field
          required
          name="price"
          label="商品価格"
          value={price}
          onChange={handleChange}
        />
        <br />
        <Field
          required
          name="date"
          label="発売日"
          value={date}
          onChange={handleChange}
        />
        <br />
        {id ? (
          <Btn onClick={addItem}>Update</Btn>
        ) : (
          <Btn onClick={addItem}>Add</Btn>
        )}
      </div>
    </div>
  );
};

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginTop: '20px',
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  display: 'block',
  color: 'white',
});

const Field = styled(TextField)({
  color: 'white',
});
export default ItemForm;
