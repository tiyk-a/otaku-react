import { Box } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import { Input } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja';

/**
 *　TV１件を表示するコンポーネント
 *
 * @param {object} program
 * @returns jsx
 */
const Program = ({ program, teamId }) => {
  const moment = require("moment");
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    setTitle(program.title);
    setDescription(program.description);
    setDate(moment(program.date).format('YYYY-MM-DD'));
  }, []);

  // 既存商品の更新
  const updTv = async() => {
    const data = {
      id: program.id,
      title: title,
      description: description,
      on_air_date: date
    }

    await axios
      .post(ApiPath.TV + teamId + '/' + program.id, data)
      .then(response => {
        if (response.data) {
          window.location.reload();
        } else {
          window.alert("更新エラーです");
        }
      })
      .catch(error => {});
  };

  const delTv = async () => {
    await axios
      .delete(ApiPath.TV + program.id)
      .then(response => {
        // 処理が成功したらresponseにはstatus=200,data=trueを返却するようにしてる
        if (response.data) {
          window.location.reload();
        } else {
          window.alert("削除エラーです");
          console.log(response);
        }
      })
      .catch(error => {});
  };

  // 入力された日付をSTATEに反映
  const handleChangeDate = e => {
      setDate(e);
  };

  // 各要素が入力されたらSTATEをアップデート
  const handleChange = e => {
    const txt = e.target.value;
    console.log(e.target.name);

    switch (e.target.name) {
      case 'p_name':
        setTitle(txt);
        break;
      case 'description':
        setDescription(txt);
        break;
      default:
        break;
    }
  };

  return (
    <div className="itemContainer">
      <Text>
        <ul>
          <li>{program.id}</li>
          <li>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
              <DatePicker
                variant="inline"
                inputVariant="standard"
                format="yyyy/MM/dd"
                id="date"
                label="発売日"
                value={date}
                onChange={handleChangeDate}
                className="dateForm"
                autoOk={true}
              />
            </MuiPickersUtilsProvider>
          </li>
          <li className="textBoxTitle">
            <Input
              type="text"
              name="p_name"
              value={title}
              onChange={handleChange}
              placeholder="title"
              className="titleInput"
          　/>
          </li>
          {/* <li className="textBox" onClick={editTv}> */}
          <li className="textBox">
            <TextField
              required
              name="description"
              label="description"
              value={description}
              onChange={handleChange}
              fullWidth={true}
              multiline={true}
              rows={3}
              rowsMax={5}
            />
          </li>
          <li>
            <Btn onClick={updTv}>更新</Btn>
            <Btn onClick={delTv}>DELETE</Btn>
          </li>
        </ul>
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

export default Program;
