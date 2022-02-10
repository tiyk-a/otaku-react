import { Button, TextField } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja';
import axios from '../axios';
import { ApiPath } from '../constants';

/**
 * 新規商品登録or商品情報アップデート時のフォーム
 */
const ItemForm = (teamIdObj) => {

  const teamId = teamIdObj.teamIdObj;

  // 商品のID
  const { id } = useParams();

  const history = useHistory();

  // 【商品データ用のSTATES】
  // 商品タイトルのSTATE
  const [title, setTitle] = useState('');
  // 商品コードのSTATE
  const [itemCode, setItemCode] = useState('');
  // 商品説明文のSTATE
  const [description, setDescription] = useState('');
  // 商品価格のSTATE
  const [price, setPrice] = useState(0);
  // 発売日のSTATE
  const [date, setDate] = useState('');
  // Itemを登録する元となるErrorJsonIdのSTATE
  const [ejId, setEjId] = useState('');
  const [wpId, setWpId] = useState('');

  useEffect(() => {
    console.log(teamId);
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
      case 'item_code':
        setItemCode(txt);
        break;
      case 'description':
        setDescription(txt);
        break;
      case 'price':
        setPrice(txt);
        break;
      case 'ejId':
        setEjId(txt);
        break;
      default:
        break;
    }
  };

  // 入力された日付をSTATEに反映
  const handleChangeDate = e => {
      setDate(e);
  };

  // 商品編集の場合の商品取得
  const findData = () => {
    axios
      .get(ApiPath.IM + teamId + '/' + id)
      .then(response => {
        const item = response.data;
        setTitle(item.title);
        setDescription(item.item_caption);
        setPrice(item.price);
        setDate(item.publication_date);
        setWpId(item.wp_id);
      })
      .catch(error => {});
  };

  // 既存IMの更新
  const axiosItemPut = async () => {
    const data = {
      item_m_id: id,
      url: null,
      title: title,
      wp_id: wpId,
      item_caption: description,
      publication_date: date,
      price: price,
      fct_chk: null,
      del_flg: null,
    }
    await axios
      .post(ApiPath.IM + teamId + '/' + id, data)
      .then(response => {
        history.push('/');
        clearItemStates();
      })
      .catch(error => {});
  };

  // Item新規追加
  const axiosItemAdd = async () => {
    const Item = {
      item_id: null,
      site_id: 3,
      item_code: itemCode,
      url: null,
      price: price,
      title: title,
      item_caption: description,
      publication_date: date,
      fct_chk: true,
      del_flg: false,
      im_id: null,
      created_at: null,
      updated_at: null,
    }

    const data = {
      item: Item,
      jsonId: ejId,
    }

    console.log(ApiPath.ITEM + "team/" + teamId);
    await axios
      .post(ApiPath.ITEM + "team/" + teamId, data)
      .then(response => {
        clearItemStates();
        window.location.reload();
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
  const upItem = async (item) => {
    axiosItemPut(item);
  };

  return (
    <div>
      <div className="newItemForm">
        <h2>新規Item登録</h2>
        <p>
          <b>Title</b>
        </p>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
          <TextField
            required
            name="title"
            label="商品名"
            value={title}
            onChange={handleChange}
            fullWidth={true}
          />
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
            minRows={3}
            maxRows={5}
          />
          <br />
          <TextField
            required
            name="item_code"
            label="商品コード"
            value={itemCode}
            onChange={handleChange}
            fullWidth={true}
          />
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
          <DatePicker
            variant="inline"
            inputVariant="standard"
            format="yyyy/MM/dd"
            id="date"
            value={date}
            onChange={handleChangeDate}
            className="dateForm"
            autoOk={true}
          />
          <br />
          <Field
            required
            name="ejId"
            label="ErrorJsonId"
            value={ejId}
            onChange={handleChange}
          />
        </MuiPickersUtilsProvider>
        <br />
          <Btn onClick={upItem}>Update</Btn>
          <Btn onClick={axiosItemAdd}>新規登録</Btn>
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
export default ItemForm;
