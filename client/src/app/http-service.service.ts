import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class HttpServiceService {
  isDevMode = false;

  constructor(
    public http: Http,
    public router: Router
  ) { }

  getServerUrl() {
    if(this.isDevMode) {
      return 'http://192.168.0.10:3000';
    }
    return 'https://www.feed100.me';
  }

  localLogin(username, password, role) {
    let url = this.getServerUrl() + '/common/api/login';
    let data = {
      "username" : username,
      "password" : password,
      "role" : role
    };
    let headers = new Headers();
    headers.append('Content-type', 'application/json');
    return this.http.post(url, data, { headers: headers }).map(res => res.json());
  }

  logout() {
    localStorage.clear();
    alert('로그아웃되었습니다.');
    this.router.navigate([ '/admin/login' ]);
  }

  refreshTokens() {
    let url = this.getServerUrl() + '/common/api/refresh';
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let refreshToken = localStorage.getItem('refreshToken');
    headers.append('x-refresh-token', refreshToken);
    return this.http.post(url, {}, { headers: headers }).map(res => res.json());
  }

  apiRequestErrorHandler(data) {
    console.log(data.message);
    return new Promise(
      (resolve, reject) => {
        if(data.message == 'jwt expired') {
          alert('액세스 토큰 만료.');
          this.refreshTokens()
          .subscribe(
            (data) => {
              console.log(JSON.stringify(data));
              if(data.success == true) {
                localStorage.setItem('accessToken', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);
                alert('액세스 토큰 재발급 성공. 자동 로그인 되었습니다.');
                resolve();
              }
              else if(data.success == false) {
                this.logout();
              }
            },
            (err) => {
              console.log(JSON.stringify(err));
              alert('오류가 발생했습니다.');
            }
          )
        }
        else {
          this.logout();
        }
      }
    );
  }

  getCompanyList() {
    let url = this.getServerUrl() + '/admin/api/companies';
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let accessToken = localStorage.getItem('accessToken');
    headers.append('x-access-token', accessToken);
    return this.http.get(url, { headers: headers }).map(res => res.json());
  }

  getUserInfo() {
    let url = this.getServerUrl() + '/admin/api/user';
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let accessToken = localStorage.getItem('accessToken');
    headers.append('x-access-token', accessToken);
    return this.http.get(url, { headers: headers }).map(res => res.json());
  }

  uploadFiles(formData: FormData) {
    let url = this.getServerUrl() + '/common/api/upload/tmp';
    let headers = new Headers();

    let accessToken = localStorage.getItem('accessToken');
    headers.append('x-access-token', accessToken);
    return this.http.post(url, formData, { headers: headers }).map(res => res.json());
  }

  moveFiles(images) {
    let url = this.getServerUrl() + '/common/api/move';
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let accessToken = localStorage.getItem('accessToken');
    headers.append('x-access-token', accessToken);
    return this.http.post(url, { "images" : images }, { headers: headers }).map(res => res.json());
  }

  registerProject(data) {
    let url = this.getServerUrl() + '/admin/api/project';
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let accessToken = localStorage.getItem('accessToken');
    headers.append('x-access-token', accessToken);
    return this.http.post(url, data, { headers: headers }).map(res => res.json());
  }

  registerNewsfeed(data) {
    let url = this.getServerUrl() + '/admin/api/newsfeed';
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let accessToken = localStorage.getItem('accessToken');
    headers.append('x-access-token', accessToken);
    return this.http.post(url, data, { headers: headers }).map(res => res.json());
  }

  getReportList() {
    let url = this.getServerUrl() + '/admin/api/reports';
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let accessToken = localStorage.getItem('accessToken');
    headers.append('x-access-token', accessToken);
    return this.http.get(url, { headers: headers }).map(res => res.json());
  }

  getPointHistories() {
    let url = this.getServerUrl() + '/admin/api/point-histories';
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let accessToken = localStorage.getItem('accessToken');
    headers.append('x-access-token', accessToken);
    return this.http.get(url, { headers: headers }).map(res => res.json());
  }

  completeExchange(data) {
    let url = this.getServerUrl() + '/admin/api/point-exchange';
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let accessToken = localStorage.getItem('accessToken');
    headers.append('x-access-token', accessToken);
    return this.http.put(url, data, { headers: headers }).map(res => res.json());
  }


}
