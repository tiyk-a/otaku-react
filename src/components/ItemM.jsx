import { Box, Button, TextField, Input } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
import NativeSelect from '@mui/material/NativeSelect';

/**
 *　商品１件を表示するコンポーネント
 *
 * @param {object} item
 * @returns jsx
 */
const ItemM = ({ item }) => {
  var exportFunction = require('../functions/TeamIdToName');
  
  const moment = require("moment");
  const date = moment(item.pubDate).format('YYYY/MM/DD');
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [verArr, setVerArr] = useState([]);
  const [tmpVer, setTmpVer] = useState('');
  const [editedFlg, setEditedFlg] = useState(false);
  const [teamIdList, setTeamIdList] = useState([]);
  const [memIdList, setMemIdList] = useState([]);
  const [allTeamIdList, setAllTeamIdList] = useState([]);
  const [allMemIdList, setAllMemIdList] = useState([]);
  const [addIMrelFlg, setAddIMrelFlg] = useState(false);
  const [media, setMedia] = useState(1);
  const [showMem, setShowMem] = useState(false);

  /**
   * 
   */
  useEffect(() => {
    // メディア判定
    isSmartPhone();

    setTitle(item.title);

    // verを登録する（im_v_idとver_name, im_idを配列にして入れる）
    setVerArrFunc(item.ver);

    setId(item.id);
    setImage(item.image);
    setTeamIdList(item.teamArr);
    setMemIdList(item.memArr);
    setAllTeamIdList(exportFunction.getAllTeam());
    setAllMemIdList(exportFunction.getAllMember());
  }, [item.id, item.image, item.relList, item.relMList, item.title, item.ver, item.teamArr, item.memArr]);

  /**
   * メディア判別
   */
  const isSmartPhone = () => {
    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
      // SP
      setMedia(2);
    } else {
      setMedia(1);
    }
  }

  /**
   * ver配列を設定する
   * 
   * @param {*} ver 
   */
  const setVerArrFunc = (ver) => {
    // verを登録する（im_v_idとver_name, im_idを配列にして入れる）
    const outerArray = [];
    ver.forEach(ver => {
      const innerArray = [];
      innerArray.push(ver.im_v_id, ver.ver_name, ver.im_id);
      outerArray.push(innerArray);
    });
    setVerArr(outerArray);
  }

  /**
   * ブログを更新する
   * 
   * @param {*} item 
   */
  const upBlog = async (item) => {
    window.alert("ブログ更新発火！処理します");
    await axios
      .get(ApiPath.IM + 'blog?imId=' + id, item)
      .then(response => {
        if (response.data) {
          var tmpUrl = window.location.href;
          var newUrl = tmpUrl.replace("http://localhost:3000/", "");
          var newUrl2 = newUrl.replace("http://chiharu-front.herokuapp.com/", "");
          window.location.href = newUrl2;
        } else {
          window.alert("ブログ投稿エラーです");
        }
      })
      .catch(error => {
        if (error.code === "ECONNABORTED") {
          window.alert("タイムアウトしました");
        }
      });
  };

  /**
   * IMを削除する
   */
  const delIm = async () => {
    await axios
      .delete(ApiPath.IM + id)
      .then(response => {
        // 処理が成功したらresponseにはstatus=200,data=trueを返却するようにしてる
        if (response.data) {
          var tmpUrl = window.location.href;
          var newUrl = tmpUrl.replace("http://localhost:3000/", "");
          var newUrl2 = newUrl.replace("http://chiharu-front.herokuapp.com/", "");
          window.location.href = newUrl2;
        } else {
          window.alert("削除エラーです");
          console.log(response);
        }
      })
      .catch(error => {
        if (error.code === "ECONNABORTED") {
          window.alert("タイムアウトしました");
        }
      });
  };

  /**
   * タイトルを変更する
   * @param {*} e 
   */
  const handleChangeTitle = e => {
    const txt = e.target.value;
    setTitle(txt);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  /**
   * Image変更
   * @param {*} e 
   */
  const handleChangeImage = e => {
    const txt = e.target.value;
    setImage(txt);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  /**
   * メンバーの表示非表示をtoggle
   */
  const toggleShowMem = () => {
    if (!showMem) {
      setShowMem(true);
    } else {
      setShowMem(false);
    }
  }

  /**
   * ver配列を変更する
   * 
   * @param {*} e 
   */
  const handleVerArr = e => {
    const txt = e.target.value;
    var verId = e.target.parentNode.getAttribute('data');

    if (verId === null || verId === undefined) {
        // IDがないということは新規追加
        setTmpVer(txt);
    } else {
        // IDあるので更新
        // 1. Make a shallow copy of the items
        let vers = [...verArr];
        // 2. Make a shallow copy of the item you want to mutate
        let ver = {...vers[verId]};
        // 3. Replace the property you're intested in
        ver[1] = txt;
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        vers[verId] = [ver[0], ver[1], ver[2]];
        // 5. Set the state to our new copy
        setVerArr(vers);
    }
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  /**
   * ver配列を追加する
   * 
   * @param {*} e 
   */
  const addVerArr = e => {
    if (e.keyCode === 13) {
      const tmpArr = [null, tmpVer, id];
      setVerArr([...verArr, tmpArr]);
      setTmpVer("");
      if (!editedFlg) {
        setEditedFlg(true);
      }
    }
  }

  /**
   * IMを更新する
   */
  const updIM = async () => {
    const data = {
      im_id: id,
      title: title,
      publication_date: date,
      amazon_image: image,
      del_flg: false,
      vers: verArr,
      teamArr: teamIdList.join(','),
      memArr: memIdList.join(','),
    }

    await axios
    .post(ApiPath.IM + "upd", data)
    .then(response => {
      if (response.data) {
        var tmpUrl = window.location.href;
        var newUrl = tmpUrl.replace("http://localhost:3000/", "");
        var newUrl2 = newUrl.replace("http://chiharu-front.herokuapp.com/", "");
        window.location.href = newUrl2;
      } else {
        window.alert("更新エラーです");
      }
    })
    .catch(error => {
      if (error.code === "ECONNABORTED") {
        window.alert("タイムアウトしました");
      }
    });
  };

  /**
   * アイキャッチを更新する
   */
  const updEyeCatch = async () => {
    await axios
    .get(ApiPath.IM + "eye?id=" + id)
    .then(response => {
      if (response.data) {
        var tmpUrl = window.location.href;
        var newUrl = tmpUrl.replace("http://localhost:3000/", "");
        window.location.href = newUrl;
      } else {
        window.alert("更新エラーです");
      }
    })
    .catch(error => {
      if (error.code === "ECONNABORTED") {
        window.alert("タイムアウトしました");
      }
    });
  }

  /**
   * チームを配列に追加する
   * 
   * @param {*} e 
   */
  const handleChangeAddTeam = e => {
    setTeamIdList(exportFunction.addTeam(e.target.value, teamIdList));
  }

  /**
   * indexのチームを変更する
   * 
   * @param {*} e 
   */
  const changeTeamByIndex = e => {
    setTeamIdList(exportFunction.changeTeamByIndex(e, teamIdList));
  }

  /**
   * チームを追加するtoggle
   */
  const toggleAddTeamFlg = () => {
    if (addIMrelFlg) {
      setAddIMrelFlg(false);
    } else {
      setAddIMrelFlg(true);
    }
  }

  /**
   * チームを抜きます
   * 
   * @param {*} index 
   */
  const minusTeam = (index) => {
    setTeamIdList(exportFunction.minusTeam(index, teamIdList));
  }

  /**
   * メンバーをtoggleします
   * 
   * @param {*} memberId 
   */
  const toggleMem = (memberId) => {
    setMemIdList(exportFunction.toggleMem(memberId, memIdList));
  }

  return (
    <div className={editedFlg ? "editedStyle itemContainer" : "notPostedStyle itemContainer"}>
      {editedFlg ? (<div className="target_im" id={item.id} data-title={title} data-date={date} data-image={image} data-verarr={verArr} data-teamarr={teamIdList} data-memarr={memIdList}></div>) : (null)}
    <Text>
        <ul className={media === 1 ? "row" : "column"}>
          <li className={media === 1 ? null : "column"}>
            {function () {
              if (teamIdList !== null && teamIdList !== undefined) {
                return (
                  <>
                    {function() {
                      if (showMem) {
                        return (
                          <Button className="button-pink" onClick={toggleShowMem}>Mem編集完了</Button>
                        )
                      } else {
                        return (
                          <Button className="button-pink" onClick={toggleShowMem}>Mem編集</Button>
                        )
                      }
                    }()}
                    {teamIdList.map((e, index) => (
                      <div className={media === 1 ? "row" : "column"}>
                        <NativeSelect
                          labelId="demo-simple-select-label"
                          id={e}
                          defaultValue=""
                          value={exportFunction.teamIdToName(e) + ":" + index}
                          label="Team"
                          onChange={changeTeamByIndex}
                          name={index}
                        >
                        {allTeamIdList !== null && allTeamIdList !== undefined ? (
                          allTeamIdList.map((f, index2) => (
                            <option key={e} value={exportFunction.teamIdToName(f.id) + ":" + index}>
                              {exportFunction.teamIdToName(f.id)}
                            </option>
                            ))
                        ) : (
                          <></>
                        )}
                        </NativeSelect>
                        {e === 4 ? (
                          <p onClick={() => minusTeam(index)} > - </p>
                        ) : (null)
                        }
                        {function() {
                          if (showMem) {
                            return (
                              <div class="flex_column width_6rem">
                                {function() {
                                  if (allMemIdList !== null && allMemIdList !== undefined) {
                                    return (
                                      <div>
                                        {allMemIdList.map((g, index) => (
                                          <div>
                                            {function() {
                                              if (g.teamId === Number(e)) {
                                                if (memIdList.includes(g.id) || memIdList.includes(g.id.toString())) {
                                                  return (
                                                    <div>
                                                      <p className="colorRed" onClick={() => toggleMem(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                                    </div>
                                                )
                                                } else {
                                                  return (
                                                    <div>
                                                      <p onClick={() => toggleMem(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                                    </div>
                                                  )
                                                }
                                              }
                                            }()}
                                          </div>
                                        ))}
                                      </div>
                                    )
                                }
                                }()}
                              </div>
                            )
                          }
                        }()}
                      </div>
                  ))}
                  </>
                )
              }
            }()}
          <div className={"row"}>
            {addIMrelFlg ? (
              <NativeSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue=""
                value={exportFunction.teamIdToName(4)}
                label="Age"
                onChange={handleChangeAddTeam}
                name="tmpIrel"
              >
              {allTeamIdList !== null && allTeamIdList !== undefined ? (
                allTeamIdList.map((f, index2) => (
                  <option key={4} value={exportFunction.teamIdToName(f.id)}>
                    {exportFunction.teamIdToName(f.id)}
                  </option>
                  ))
              ) : (
                <></>
              )}
              </NativeSelect>
            ) : (
              <Button className="button-pink" onClick={toggleAddTeamFlg}>+imrel</Button>
            )}
          </div>
          </li>
          <li>
            IMId: {item.id}
            <br />
            {date}
          </li>
          <li className={media === 1 ? "textBoxTitle" : "textBoxTitleSp"}>
            <Input
              type="text"
              name="IM register"
              value={title}
              onChange={handleChangeTitle}
              placeholder="imId"
              className="titleInput"
            />
            <TextField
              required
              name="amazon image"
              label="amazon image"
              value={image}
              onChange={handleChangeImage}
              fullWidth={true}
              multiline={true}
              rows={3}
              rowsMax={5}
            />
          </li>
          <li className={media === 1 ? "textBox" : "textBoxSp"}>
            <Input
              type="text"
              row="5"
              name="ver"
              value={tmpVer}
              onChange={handleVerArr}
              placeholder="バージョン(記号x,Enterで追加)"
              className="titleInput"
              onKeyDown={addVerArr}
            />
            {verArr.length > 0 ? (
              verArr.map((e, index) => (
                <div className="itemBox" key={index}>
                  <Input
                    type="text"
                    name="ver"
                    value={e[1]}
                    data={index}
                    onChange={handleVerArr}
                    placeholder="ver"
                    className="titleInput"
                  />
                </div>
              ))
            ):("")
            }
            <p>{item.url}</p>
          </li>
          <li>
            {/* TODO:クラス分岐なし？ */}
            <span className={media === 1 ? "column" : "column"}>
              <Button className="button-pink" onClick={updIM}>IM更新</Button>
              <Button className="button-pink" onClick={updEyeCatch}>アイキャッチ更新</Button>
              <Button className="button-pink" onClick={upBlog}>Blog更新</Button>
              <Button className="button-pink" onClick={delIm}>DELETE</Button>
            </span>
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

export default ItemM;
