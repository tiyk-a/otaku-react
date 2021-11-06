import { Button, TextField } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import axios from '../axios';
import { ApiPath } from '../constants';

/**
 * 新規商品登録or商品情報アップデート時のフォーム
 */
const TvForm = () => {
  // 商品のID
  const { id } = useParams();
  const { teamId } = useParams();

  const history = useHistory();

  // 【商品データ用のSTATES】
  // 商品タイトルのSTATE
  const [title, setTitle] = useState('');
  // 商品説明文のSTATE
  const [description, setDescription] = useState('');
  // 商品価格のSTATE
  const [date, setDate] = useState('');

  useEffect(() => {
    if (id) {
      findData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 現在のページ
  const location = useLocation();

  useEffect(() => {
    setTitle('');
    setDescription('');
    // setPrice('');
  }, [location]);

  // 各要素が入力されたらSTATEをアップデート
  const handleChange = e => {
    const txt = e.target.value;

    switch (e.target.name) {
      case 'title':
        // checkTitle(txt);
        setTitle(txt);
        break;
      case 'description':
        // checkDescription(txt);
        setDescription(txt);
        break;
      case 'date':
        // checkPriceInput(txt);
        setDate(txt);
        break;
      default:
        break;
    }
  };

  // 商品編集の場合の商品取得
  const findData = () => {
    axios
      .get(ApiPath.TV + id)
      .then(response => {
        const item = response.data;
        setTitle(item.title);
        setDescription(item.description);
        setDate(item.on_air_date);
      })
      .catch(error => {});
  };

  // 新規商品登録のpostを行う
  const axiosItemPost = async (item) => {
    await axios
      .post(ApiPath.TV, item)
      .then(response => {
        history.push('/tv');
        clearItemStates();
      })
      .catch(error => {});
  };

  // 既存商品の更新
  const axiosItemPut = async (item) => {
    await axios
      .post(ApiPath.TV + teamId + '/' + id, item)
      .then(response => {
        history.push('/tv');
        clearItemStates();
      })
      .catch(error => {});
  };

  // 全てのItem関連Stateをクリア
  const clearItemStates = () => {
    setTitle('');
    // setPrice('');
    setDescription('');
  };

  return (
    <div>
      <div className="newItemForm">
        <h2>新規番組登録</h2>
        <p>
          <b>番組名</b>
        </p>
        <TextField
          required
          name="title"
          label="番組名"
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
          label="詳細"
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
          <b>放送日</b>
        </p>
        <Field
          required
          name="date"
          label="商品価格"
          value={date}
          onChange={handleChange}
        />
        <br />
        {id ? (
          <Btn onClick={axiosItemPut}>Update</Btn>
        ) : (
          <Btn onClick={axiosItemPost}>Add</Btn>
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
  color: 'black',
});

const Field = styled(TextField)({
  color: 'black',
});

export default TvForm;
