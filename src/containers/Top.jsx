import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useCallback, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import { NumberParam, useQueryParam } from 'use-query-params';
import axios from '../axios';
import ItemMList from '../components/ItemMList';
import Loading from '../components/Loading';
// import GoogleCal from '../GoogleCal'
import history from '../history';

/**
 * 商品全件取得（トップページ）のコンテナ
 *
 */
const Top = () => {
  const [teamId, setTeamId] = useQueryParam('teamId', NumberParam);

  // 商品一覧リストのSTATES
  const [itemList, setItemList] = useState([]);
  const [itemMList, setItemMList] = useState([]);
  const [iimList, setIimList] = useState([]);
  const [errJList, setErrJList] = useState([]);
  const [h2, setH2] = useState('');
  const [id, setId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [relList, setRelList] = useState([]);

  // 商品全件取得
  const getTeamItems = useCallback(async (id) => {
    var path = '';

    // Top画面リクエストならallメソッドでデータ取ってくる。それ以外はチームのを取って送る
    if (id === undefined || id === 5) {
      setId(5);
      setButton(5);
      path = 'api/all/';
    } else {
      setId(id);
      setButton(id);
      path = 'api/' + id;
    }

    // imのない未来のilist
    const ilist = [];
    // 未来のimlist
    const imlist = [];
    // imがある未来のilist
    const iimlist = [];
    // errorJsonのリスト
    const errlist = [];

    await axios
      .get(path)
      .then(response => {
        const i = response.data.i;
        const im = response.data.im;
        const iim = response.data.iim;
        const errJ = response.data.errJ;

          if (i !== null) {
            const relList = [];
            console.debug("soko");
            i.forEach(item => {
              const tmpRelList = [];
              item.teamIdList.forEach(rel => {
                tmpRelList.push(rel);
              });
              relList.push(tmpRelList);
              const ele = {
                id: item.item.item_id,
                title: item.item.title,
                description: item.item.item_caption,
                price: item.item.price,
                pubDate: item.item.publication_date,
                wpId: item.item.im_id,
                relList: tmpRelList
              };
              ilist.push(ele);
            });
            // setItemList(ilist);
          }

          if (im !== null) {
            console.log("im nonaka");
            im.forEach(itemM => {
              console.log(itemM.relList);

              // relListから必要な情報を抜き出す
              var wpId = '';
              const tmpRelList = [];
              itemM.relList.forEach(rel => {
                // wpIdを取得したい
                if (rel.team_id === id) {
                  wpId = rel.wp_id;
                }

                // teamIdListを作る
                if (!tmpRelList.includes(rel.team_id)) {
                  tmpRelList.push(rel.team_id);
                }
              });

              const m = {
                id: itemM.im.im_id,
                title: itemM.im.title,
                price: itemM.im.price,
                pubDate: itemM.im.publication_date,
                wpId: wpId,
                ver: itemM.verList,
                relList: tmpRelList,
              };
            imlist.push(m);
            });
          }

          if (iim !== null) {
            console.log("iim nonaka");
            iim.forEach(item => {
              console.log(item);
              const iim = {
                id: item.item.item_id,
                title: item.item.title,
                description: item.item.item_caption,
                price: item.item.price,
                pubDate: item.item.publication_date,
                wpId: item.item.im_id,
              };
              iimlist.push(iim);
            });
          }

          if (errJ !== null) {
            console.log("errJ nonaka");
            errJ.forEach(j => {
              console.log(j);
              const ele = {
                id: j.errj_id,
                teamId: j.team_id,
                json: j.json,
              };
              errlist.push(ele);
            });
          }

          setItemList(ilist);
          setItemMList(imlist);
          setIimList(iimlist);
          setErrJList(errlist);
      }).catch(error => {});
  }, []);

  useEffect(() => {
    // const googleCal = new GoogleCal;
    // googleCal.connect()
    // .then(() => {
    //   return googleCal.getTodayEvents(); // 誕生日や祝日のカレンダーは取得対象から除外
    // })
    // .then(val => {
    //   console.log(val);

    // });

    if (teamId === undefined) {
      setTeamId(5);
      setButton(5);
    }
    getTeamItems(teamId);
    setButton(teamId);
    
    setIsLoading(false);
  }, [getTeamItems]);

  const handleChange = e => {
    history.push('/?teamId=' + e);
    getTeamItems(e);
  };

  const setButton = e => {
    switch (e) {
      case 5:
        setH2('All');
        break;
      case 6:
        setH2('SnowMan');
        break;
      case 7:
        setH2('関ジャニ∞');
        break;
      case 8:
        setH2('SexyZone');
        break;
      case 9:
        setH2('TOKIO');
        break;
      case 10:
        setH2('V6');
        break;
      case 11:
        setH2('嵐');
        break;
      case 12:
        setH2('NEWS');
        break;
      case 13:
        setH2('Kis-My-Ft2');
        break;
      case 14:
        setH2('ABC-Z');
        break;
      case 15:
        setH2('ジャニーズWEST');
        break;
      case 16:
        setH2('King&Prince');
        break;
      case 17:
        setH2('SixTONES');
        break;
      case 18:
        setH2('なにわ男子');
        break;
      case 19:
        setH2('Hey!Say!JUMP');
        break;
      case 20:
        setH2('KAT-TUN');
        break;
      case 21:
        setH2('Kinki Kids');
        break;
      default:
        setH2('SnowMan');
        break;
    }
  }

  return (
    <div>
      {
        function() {
          if (isLoading) {
            return (
              <div>
                <Loading />
              </div>
            )
          } else {
            return (
              <div>
                <Btn value="5" onClick={() => handleChange(5)}>All</Btn>
                <Btn value="17" onClick={() => handleChange(17)}>SixTONES</Btn>
                <Btn value="6" onClick={() => handleChange(6)}>SnowMan</Btn>
                <Btn value="11" onClick={() => handleChange(16)}>King&Prince</Btn>
                <Btn value="11" onClick={() => handleChange(18)}>なにわ男子</Btn>
                <Btn value="8" onClick={() => handleChange(8)}>SexyZone</Btn>
                <Btn value="7" onClick={() => handleChange(7)}>関ジャニ∞</Btn>
                <Btn value="13" onClick={() => handleChange(13)}>Kis-My-Ft2</Btn>
                <Btn value="11" onClick={() => handleChange(15)}>ジャニーズWEST</Btn>
                <Btn value="11" onClick={() => handleChange(19)}>Hey!Say!JUMP</Btn>
                <Btn value="11" onClick={() => handleChange(14)}>ABC-Z</Btn>
                <Btn value="11" onClick={() => handleChange(20)}>KAT-TUN</Btn>
                <Btn value="12" onClick={() => handleChange(12)}>NEWS</Btn>
                <Btn value="11" onClick={() => handleChange(21)}>Kinki Kids</Btn>
                <Btn value="9" onClick={() => handleChange(9)}>TOKIO</Btn>
                <Btn value="10" onClick={() => handleChange(10)}>V6</Btn>
                <Btn value="11" onClick={() => handleChange(11)}>嵐</Btn>
                <h2>{h2}</h2>
                {
                  function() {
                    if (id === 5) {
                      return (
                        <div>
                          <ItemMList itemList={itemList} itemMList={itemMList} iimList={iimList} teamId={id} errJList={errJList} />
                        </div>
                        // <p>{itemList}{itemMList}{iimList}{id}{errJList}</p>
                      )
                    } else {
                      return (
                        <ItemMList itemList={itemList} itemMList={itemMList} iimList={iimList} teamId={id} errJList={errJList} />
                      )
                    }
                  }()
                }
              </div>
            )
          }
        }()
      }
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
  color: 'black',
});

export default Top;
