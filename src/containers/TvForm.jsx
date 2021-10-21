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
  // const apiUrl = ApiPath.ITEM.replace('$id', id);

  const history = useHistory();

  // 【商品データ用のSTATES】
  // 商品タイトルのSTATE
  const [title, setTitle] = useState('');
  // 商品説明文のSTATE
  const [description, setDescription] = useState('');
  // 商品価格のSTATE
  const [date, setDate] = useState('');

  // 【商品各データ用のバリデーションメッセージSTATES】
  // 商品タイトルのバリデーションメッセージSTATE
//   const [maxLengthTitleMsg, setMaxLengthTitleMsg] = useState('');
  // 商品説明文のバリデーションメッセージSTATE
//   const [maxLengthDescriptionMsg, setMaxLengthDescriptionMsg] = useState('');
  // 商品価格のバリデーションメッセージSTATE
//   const [maxLengthPriceMsg, setMaxLengthPriceMsg] = useState('');

  // 【商品各データ用バリデーションSTATES】
  // 商品タイトルのバリデーションSTATE
//   const [validationTitle, setValidationTitle] = useState(false);
//   // 商品説明文のバリデーションSTATE
//   const [validationDescription, setValidationDescription] = useState(false);
//   // 商品価格のバリデーションSTATE
//   const [validationPrice, setValidationPrice] = useState(false);


  useEffect(() => {
    if (id) {
      findData();
//       setValidationTitle(true);
//       setValidationDescription(true);
//       setValidationPrice(true);
//     } else {
//       setTitle('');
//       setDescription('');
//       setPrice('');
//       setValidationTitle(false);
//       setValidationDescription(false);
//       setValidationPrice(false);
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

  // Priceへの入力が有効か確認
//   const checkPriceInput = txt => {
//     if (!isNaN(txt)) {
//       // 引数が数字である
//       if (txt > 0 && txt < 10000000) {
//         setValidationPrice(true);
//       } else {
//         setMaxLengthPriceMsg('価格は0円以上10000000(1千万)以下で指定してね！');
//         setValidationPrice(false);
//       }
//     } else {
//       // 引数が数字ではない
//       setMaxLengthPriceMsg('数字を入れてね');
//       setValidationPrice(false);
//     }
//   };

  //Titleに入力された文字が有効か確認
//   const checkTitle = txt => {
//     if (txt.length > 0 && txt.length < 101) {
//       setValidationTitle(true);
//     } else {
//       setMaxLengthTitleMsg('商品タイトルは100文字以内で入力してください');
//       setValidationTitle(false);
//     }
//   };

  //Descriptionに入力された文字が有効か確認
//   const checkDescription = txt => {
//     if (txt.length > 0 && txt.length < 501) {
//       setValidationDescription(true);
//     } else {
//       setMaxLengthDescriptionMsg('商品説明は500文字以内で入力してください');
//       setValidationDescription(false);
//     }
//   };

  // 商品編集の場合の商品取得
  const findData = () => {
    axios
      .get(ApiPath.TV + id)
      .then(response => {
          console.log(response);
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
      // .post(ApiPath.ITEMS, item)
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
      .post(ApiPath.TV + id, item)
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

  // 商品追加
//   const addItem = async () => {
    // checkTitle(title);
    // checkDescription(description);
    // checkPriceInput(price);

    // バリデーションを確認
    // if (validationTitle && validationDescription && validationPrice) {
    //   let item = {};
    //   if (!id) {
    //     item = {
    //       id: '',
    //       title,
    //       description,
    //       price,
    //     };
    //     axiosItemPost(item);
    //   } else {
    //     item = {
    //       title: title,
    //       price: price,
    //       description: description,
    //     };
    //     axiosItemPut(item);
    //   }
    // } else {
    //   window.alert('入力値を確認してください');
    // }
//   };

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
        //   helperText={maxLengthTitleMsg}
          fullWidth={true}
        //   placeholder="商品名は100文字以内で入力してください"
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
        //   helperText={maxLengthDescriptionMsg}
          fullWidth={true}
          multiline={true}
          rows={3}
          rowsMax={5}
        //   placeholder="商品説明文は500文字以内で入力してください"
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
        //   helperText={maxLengthPriceMsg}
        //   placeholder="0〜１千万円で入力"
        />
        {/* <p>{price.length}</p> */}
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
  color: 'white',
});

const Field = styled(TextField)({
  color: 'white',
});

export default TvForm;
