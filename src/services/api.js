/*
Since we handle Fetch requests through promises we have to return 
the fetch promise to be uses in App.js

1 note is that our deleteRequest method does not strictly need
to return the fetch since we don't use it for anything in App.js. 
However for the sake of code consistency we do so. 
*/


const updateCelebratedRequest = (baseURL, holiday) => {
  return fetch(baseURL + '/holidays/' + holiday._id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ celebrated: !holiday.celebrated })
  }).then(res => res.json());
}


const updateLikesRequest = (baseURL, holiday) => {
  return fetch(baseURL + '/holidays/' + holiday._id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ likes: holiday.likes += 1 })
  }).then(res => res.json());
}


const deleteRequest = (baseURL, id) => {
  return fetch(baseURL + '/holidays/' + id, {
    method: 'DELETE',
  }).then(res => res.json());
}


export {
  updateCelebratedRequest,
  updateLikesRequest,
  deleteRequest,
}
