// Some helper functions

export function generateSlug(str) {
  return str.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
};

export function setRoutePath(path, serverRendering = false) {
  window.location.replace(serverRendering ? 
    ('/' + path + location.search) :   // TODO: Assuming replacing entire pathname
    window.location.pathname + window.location.search +  '#/' + path);
};

export function getRoutePath(serverRendering = false) {
  return serverRendering ? 
    window.location.pathname.substr(1) : 
    window.location.hash.replace(/^#\/?|\/$/g, '');
};

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}
