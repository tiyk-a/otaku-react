import { Box } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Input } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

/**
 *　商品１件を表示するコンポーネント
 *
 * @param {object} item
 * @returns jsx
 */
const Item = ({ item, teamId, itemMList }) => {
  const moment = require("moment");
  const [id, setId] = useState('');
  const [imId, setImId] = useState('');
  const [intoId, setIntoId] = useState('');
  const [date, setDate] = useState('');
  const [fromIM, setFromIM] = useState('');
  const [toIM, setToIM] = useState('');
  const [title, setTitle] = useState('');
  const [imTitle, setImTitle] = useState("");
  const [tmpVer, setTmpVer] = useState('');
  const [verArr, setVerArr] = useState([]);

  useEffect(() => {
    setId(item.id);
    setDate(moment(item.pubDate).format('YYYY-MM-DD'));
    setImId(0);
    setTitle(item.title);
  }, [item.id, item.pubDate, item.title, moment]);

  const nl2br = require('react-nl2br');

  const upBlog = async (item) => {
    if (teamId !== undefined) {
      await axios
        .get(ApiPath.ITEM + 'blog?imId=' + id + '&team=' + teamId, item)
        .then(response => {
          console.log(response);
          window.location.reload();
        })
        .catch(error => {});
    }
  };

  const registerIM = async () => {
    if (teamId !== undefined) {
      if (imId === 0) {
        setImId(undefined);
      }
      const data = {
        item_id: id,
        im_id: imId,
        teamId: teamId,
        title: title,
        wp_id: "",
        publication_date: date,
        del_flg: false,
        verArr: verArr,
      }
      await axios
        .post(ApiPath.IM, data)
        .then(response => {
          console.log(response);
          window.location.reload();
        })
        .catch(error => {});
    }
  };

  // 入力された検索ワードをSTATEに反映
  const handleChangeDate = e => {
    console.log(e);
    setDate(e);
  };

  // 入力された検索ワードをSTATEに反映
  const handleChangeTitle = e => {
    console.log(e.target.value);
    const txt = e.target.value;
    setTitle(txt);
  };

  const handleChangeIMTitle = e => {
    console.log(e);
    const txt = e.target.value;
    setImTitle(txt);
    itemMList.forEach(item => {
      if (item.title === txt) {
        setImId(item.id);
      }
    });
  };

  const addVerArr = e => {
    if (e.keyCode === 13) {
      console.log("koko");
      console.log(verArr);
      setVerArr([...verArr, tmpVer]);
      console.log(verArr);
      setTmpVer("");
    }
    console.log(verArr[0]);
  }

  const delIm = async () => {
    if (teamId !== undefined) {
      await axios
        .delete(ApiPath.ITEM + id)
        .then(response => {
          window.location.reload();
        })
        .catch(error => {});
    }
  };

  // 入力された検索ワードをSTATEに反映
  const handleChangeImId = e => {
    const txt = e.target.value;
    setIntoId(txt);
  };

  // 入力された検索ワードをSTATEに反映
  const handleVerArr = e => {
    const txt = e.target.value;
    setTmpVer(txt);
  };

  const updImId = async (e) => {
    if (e.keyCode === 13) {
      await axios
        .get(ApiPath.IM + 'merge?ord=' + id + '&into=' + intoId)
        .then(response => {
          console.log(response);
        })
        .catch(error => {});
      setIntoId('');
    }
  };

  const updFctChk = async (e) => {
    if (imId === null || imId === undefined || imId === 0) {
    } else {
      console.log(ApiPath.IM + "chk?itemId=" + id + "&imId=" + imId);
      await axios
        .get(ApiPath.IM + "chk?itemId=" + id + "&imId=" + imId)
        .then(response => {
          console.log(response);
          window.location.reload();
        })
        .catch(error => {});
    }
  }

  const postedStyle = {
    // background: "",
  };

  const notPostedStyle = {
    background: "pink",
  };

  return (
    <div className="itemContainer" className={item.masterId !== null && item.masterId !== undefined ? "postedStyle": "notPostedStyle"}>
      <Text>
        {item.masterId !== null && item.masterId !== undefined ? 
          <ul>
            <li>{date}</li>
            <li>
              {item.id}
              <br />
              {item.masterId !== null && item.masterId !== undefined ? (item.masterId) : ("No IM")}
            </li>
            <li className="textBoxTitle">
              <p>
                <b>{item.title}</b>
              </p>
            </li>
            <li className="textBox">
              <p>{nl2br(item.description)}</p>
              <p>{item.url}</p>
            </li>
            <li className="price">
              <p>
                <b>{item.price}</b>&nbsp;yen
              </p>
            </li>
            <li>
              <Input
                type="text"
                name="Merge imId"
                value={intoId}
                onChange={handleChangeImId}
                placeholder="imId"
                onKeyDown={updImId}
              />
              <br />
              <Btn onClick={delIm}>DELETE</Btn>
            </li>
            <li><Btn onClick={upBlog}>Blog更新</Btn></li>
          </ul>
          :<ul>
            <li>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
                <DatePicker
                  variant="inline"
                  inputVariant="standard"
                  format="yyyy/MM/dd"
                  id="date"
                  label="date"
                  value={date}
                  onChange={handleChangeDate}
                  className="dateForm"
                  autoOk={true}
                />
              </MuiPickersUtilsProvider>
            </li>
            <li>
              {item.id}
              <br />
              {item.masterId !== null && item.masterId !== undefined ? (item.masterId) : ("No IM")}
            </li>
            <li className="textBoxTitle">
              <p>
                <Input
                type="text"
                name="IM register"
                value={title}
                onChange={handleChangeTitle}
                placeholder="imId"
                className="titleInput"
                />
                <FormControl fullWidth>
                  <p>IMID: {imId}</p>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue=""
                    value={imTitle}
                    label="Age"
                    onChange={handleChangeIMTitle}
                  >
                  {itemMList.map((e, index) => (
                    <MenuItem value={e.title}>{e.title}</MenuItem>
                  ))}
                  </Select>
                </FormControl>
                <br />
                <Btn onClick={registerIM}>IM新規登録・更新</Btn>
                <Btn onClick={updFctChk}>IM設定</Btn>
              </p>
            </li>
            <li className="textBox">
              <p>記号は使用しないでください</p>
              <Input
                type="text"
                name="ver"
                value={tmpVer}
                onChange={handleVerArr}
                placeholder="ver"
                className="titleInput"
                onKeyDown={addVerArr}
              />
              {
                verArr.length > 0 ? (
                    verArr.map((e, index) => (
                      <div className="itemBox" key={index}>
                        <p>{e}
                        </p>
                        <Input
                          type="text"
                          name="ver"
                          value={e}
                          onChange={handleVerArr}
                          placeholder="ver"
                          className="titleInput"
                          onKeyDown={addVerArr}
                        />
                      </div>
                    ))
                ):("")
              }
              {itemMList.map((e, index) => (
                e.id === imId ? (
                  e.ver.map((v, index) => (
                    <p>{v.ver_name}</p>
                  ))
                ) : (
                  ""
                )
              ))}
              <p>{nl2br(item.description)}</p>
              <p>{item.url}</p>
            </li>
            <li className="price">
              <p>
                <b>{item.price}</b>&nbsp;yen
              </p>
            </li>
            <li>
              <Input
                type="text"
                name="Merge imId"
                value={intoId}
                onChange={handleChangeImId}
                placeholder="imId"
                onKeyDown={updImId}
              />
              <br />
              <Btn onClick={delIm}>DELETE</Btn>
            </li>
            <li><Btn onClick={upBlog}>Blog更新</Btn></li>
          </ul>
          }
      </Text>
    </div>
  );
};

/**
 * UI(文章系をまとめるBOX)
 *
 */
const Text = styled(Box)({
  padding: '10px',
});

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  margin: '10px 0',
  color: 'black',
});

export default Item;
