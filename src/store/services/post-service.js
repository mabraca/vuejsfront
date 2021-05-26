import qs from 'qs';
import axios from 'axios';
import Jsona from 'jsona';

const url = process.env.VUE_APP_API_BASE_URL;
const jsona = new Jsona();

function list() {
  const options = {
    headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      }
  };

  return axios.get(`${url}/posts`, options)
    .then(response => {
        let color = ["alert-danger","alert-warning", "alert-info","alert-success", "alert-primary"];
        let icon =["add_alert","adjust","account_circle","accessibility", "beach_access", "bookmark_border","border_color","build","card_giftcard"];
        for(var i = 0; i < response.data.data.length; i++){
          var resp = color[Math.random() * color.length | 0];
          response.data.data[i].color = resp;
          var respIcon = icon[Math.random() * icon.length | 0];
          response.data.data[i].icon = respIcon;
        }
      return {
        list: response.data.data,
        meta: response.data.meta
      };
    });
}

function listAdmin() {
  const options = {
    headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      }
  };
  return axios.get(`${url}/posts/all`, options)
      .then(response => {
        return {
          list: response.data.data,
          meta: response.data.meta
        };
    });
}

function get(id) {
  const options = {
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    }
  };

  return axios.get(`${url}/users/${id}`, options)
    .then(response => {
      let user = jsona.deserialize(response.data);
      delete user.links;
      return user;
    });
}


function add(posts) {

  const options = {
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    }
  };

  return axios.post(`${url}/posts/create`, posts, options)
    .then(response => {
      return jsona.deserialize(response.data.data);
    });
}


function update(posts) {
  const payload = {
    data: posts
  };
  const options = {
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    }
  };

  return axios.put(`${url}/posts/update/${posts.id}`, payload, options)
    .then(response => {
      return jsona.deserialize(response.data);
    });
}

function destroy(id) {
  const options = {
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    }
  };

  return axios.delete(`${url}/posts/delete/${id}`, options);
}


export default {
  list,
  listAdmin,
  get,
  add,
  update,
  destroy
};

