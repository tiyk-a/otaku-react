import fs from 'fs'
import readline from 'readline'
import {google} from 'googleapis'
import moment from 'moment'

export default class GoogleCal {
  constructor(config){
    this.config = Object.assign({},this.defaults(),config);
  }
  /**
   * 初期値
   */
  defaults(){
    return {
      scopes : ['https://www.googleapis.com/auth/calendar'],
      tokenPath : '/app/script/token.json',

    }
  }

  /**
   * google Calendar APIへの接続と認証
   */
  connect(){
    return new Promise((resolve,reject) => {
      fs.readFile('credentials.json', (err, content) => {
        if (err){
          console.log('Error loading client secret file:', err);
          reject();
        }
        this.authorize(JSON.parse(content))
        .then(auth => {
          this.config.auth = auth;
          resolve();
        });
      });
    });
  }

  /**
   * OAuth認証処理
   * given callback function.
   * @param {Object} credentials 認証データ
   * @return (promise) object oAuth2Client.
   */
  authorize(credentials) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    return new Promise((resolve,reject) => {
      // 保存してあるトークン情報を読み取り、なければトークン生成
      fs.readFile(this.config.tokenPath, (err, token) => {
        if (err) {
          this.getAccessToken(oAuth2Client)
          .then(() => {
            resolve(oAuth2Client);
          })
        } else {
          // アクセストークンは1時間ほどしか期限がないため、毎回リフレッシュトークンから新たなトークンを生成する
          oAuth2Client.credentials = JSON.parse(token);
          oAuth2Client.refreshAccessToken((err, token) => {
            if (err) {
              console.log(err);
              reject();
            }
            oAuth2Client.setCredentials(token);
            fs.writeFile(this.config.tokenPath, JSON.stringify(token), (err) => {
              if (err){
                console.error(err);
                reject();
              }
              console.log('Token stored to', this.config.tokenPath);
            });
          });
          resolve(oAuth2Client);
        }
      });
    });
  }

  /**
   * OAuthのアクセストークンを取得
   * @param oAuth2Client {object} google.auth.OAuth2の戻り値
   * @return (promise) object 有効なtokenを含めたgoogle.auth.OAuth2
   */
  getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.config.scopes,
    });
    console.log('右記のURLをブラウザで開いてください:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve,reject) => {
      rl.question('表示されたコードを貼り付けてください: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error('トークンを発行できませんでした', err);
          oAuth2Client.setCredentials(token);
          // トークンデータをファイルに書き出し
          fs.writeFile(this.config.tokenPath, JSON.stringify(token), (err) => {
            if (err) {
              console.error(err);
              reject();
            }
            console.log('トークンを保存しました', this.config.tokenPath);
          });
          resolve(oAuth2Client);
        });
      });
    });
  }

  /**
   * イベントを取得
   * @param params {object} 取得時のパラメータ
   * @return (promise) Array イベントデータ一覧
   */
  listEvents(params) {
    if(params.calendarId.match(/#/)){
      params.calendarId = encodeURIComponent(params.calendarId);
    }
    return new Promise((resolve,reject) => {
      const calendar = google.calendar({version: 'v3', auth: this.config.auth});
      calendar.events.list(params, (err, res) => { // events.listでイベント一覧を取得
        if (err) {
          console.log('The API returned an error: ' + err);
          reject();
        }
        resolve(res.data.items);
      });
    });
  }

  /**
   * カレンダー一覧を取得
   * @return (promise) Array カレンダーデータ一覧
   */
  calendarLists(){
    return new Promise((resolve,reject) => {
      const calendar = google.calendar({version: 'v3', auth : this.config.auth});
      calendar.calendarList.list({},(err, res) => { // calendarList.listでカレンダーの一覧を取得
        resolve(res.data.items);
      })
    });
  }

  /*
   * 本日のイベントを取得
   * @param filterFunc {function} イベントを取得するカレンダーリストの条件フィルター
   */
  getTodayEvents(filterFunc = null){
    // カレンダー毎に順次処理するためのタスク
    const task = (calName,params,result) => {
      return new Promise((resolve, reject) => {
        this.listEvents(params).then(resp => {
          const data = Object.assign([],result);
          data.push({
            calName,
            items : resp
          })
          resolve(data)
        });
      });
    }

    return new Promise((resolve,reject) => {
      this.calendarLists() // カレンダー一覧を取得
      .then(calList => {
        if(filterFunc){
          calList = calList.filter(filterFunc); // イベント取得するカレンダーを絞り込み
        }
        calList.reduce((prev, current) => {
          return prev.then(resp => {
            const today = moment(moment().format("YYYY-MM-DD")).utcOffset("+09:00"); // 本日の00:00(日本時間)
            const todayMax = moment(moment().format("YYYY-MM-DD")).add(1,'days').add(-1,'minutes').utcOffset("+09:00"); // 本日の23:59(日本時間)
            const params = {
              calendarId: current.id,
              timeMin: today.format(), // 本日の0:00
              timeMax: todayMax().format(), // 本日の23:59
              singleEvents: true,
              orderBy: 'startTime',
            }
            const summary = current.summaryOverride || current.summary; // カレンダー名
            return task(summary,params,resp)
          });
        }, Promise.resolve([]))
        .then(resp => {
          resolve(resp);
        })
        .catch(()=>{
          console.log("error!")
        })
      })
    });
  }
}
