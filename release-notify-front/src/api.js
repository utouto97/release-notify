const API_BASEURL = process.env.REACT_APP_API_BASEURL;

export const getProducts = async (token) => {
  try {
    const res = await fetch(API_BASEURL + '/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    });
    return await res.json();
  } catch(e) {
    return null;
  }
};

export const getSettings = async (token) => {
  try {
    const res = await fetch(API_BASEURL + '/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    });
    return await res.json();
  } catch(e) {
    return null;
  }
};

export const postSettings = async (token, follows, webhookUrl) => {
  try {
    await fetch(API_BASEURL + '/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({
        follows: Object.keys(follows).filter((k) => follows[k]),
        webhook_url: webhookUrl,
      }),
    });
    return true;
  } catch(e) {
    return false;
  }
};
