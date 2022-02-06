import { Box } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import { Input } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja';
import exportFunction from '../functions/TeamIdToName';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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
  const [prel, setPrel] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    setId(program.id);
    setTitle(program.title);
    if (program.description !== null && program.description !== undefined) {
      setDescription(program.description);
    } else {
      setDescription("");
    }
    
    setDate(moment(program.date).format('YYYY-MM-DD HH:mm'));
    const outerArr = [];
    program.prelList.forEach((e) => {
      const innerArr = [];
      innerArr.push(e.p_rel_id, e.program_id, e.team_id);
      outerArr.push(innerArr);
    });
    setPrel(outerArr);
  }, []);

  // 既存商品の更新
  const updTv = async() => {
    const data = {
      id: program.id,
      title: title,
      description: description,
      on_air_date: date,
      prel: prel
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
    const newDate = moment(e).format('YYYY-MM-DD HH:mm');
    setDate(newDate);
  };

  // 各要素が入力されたらSTATEをアップデート
  const handleChange = e => {
    const txt = e.target.value;

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

  const handleChangePrel = e => {
    // var prelId = e.target.name;
    var prelId = e.target.name;
    // 1. Make a shallow copy of the items
    let vers = [...prel];
    // 2. Make a shallow copy of the item you want to mutate
    let ver = {...vers[prelId]};
    // 3. Replace the property you're intested in
    ver[2] = exportFunction.nameToTeamId(e.target.value);
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    vers[prelId] = [ver[0], ver[1], ver[2]];
    // 5. Set the state to our new copy
    setPrel(vers);
  }

  return (
    <div className="itemContainer">
      <Text>
        <ul>
          <li>
            <p>pId</p>
            {program.id}
          </li>
          <li>
            {prel !== null && prel !== undefined ? (
              prel.map((e, index) => (
                <div>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue=""
                  value={exportFunction.teamIdToName(e[2])}
                  label="Age"
                  onChange={handleChangePrel}
                  name={index.toString()}
                >
                {program.teamIdList !== null && program.teamIdList !== undefined ? (
                  program.teamIdList.map((f, index) => (
                    <MenuItem value={exportFunction.teamIdToName(f)} name={e[2]} key={f} >{exportFunction.teamIdToName(f)}</MenuItem>
                    ))
                ) : (
                  <></>
                )}
                </Select>
                </div>
                ))
            ) : (
              <></>
            )}
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
              <DateTimePicker
                label="on_air_date"
                value={date}
                onChange={handleChangeDate}
                format="yyyy-MM-dd HH:mm"
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
              minRows={3}
              maxRows={5}
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
