/**
* Resets the auth service.
*/
function resetAuth() {
  const properties = PropertiesService.getUserProperties();  
  properties.deleteProperty('dscc.stoken');
}

/**
* get current user (token) from cache.
*/
function loadCurrentUser() {   
  const properties = PropertiesService.getUserProperties();  
  return properties.getProperty('dscc.stoken'); 
};

/**
* save current user in cache.
*/
function saveCurrentUser(stoken) {  
  const properties = PropertiesService.getUserProperties();  
  properties.setProperty('dscc.stoken', stoken);
};

/**
* Returns true if the auth service has access.
* @return {boolean} True if the auth service has access.
*/
function isAuthValid() {
  const stoken = loadCurrentUser();   
  return stoken && validateCredentials(stoken);
};


/**
* get username and password (token) from init form and validate.
*/
function setCredentials(request) {   
  const creds = request.userToken;  
  const stoken = Utilities.base64Encode(creds.username + ':' + creds.token);
  const isValid = validateCredentials(stoken);
  
  if (isValid) {
    saveCurrentUser(stoken);
    return { errorCode: "NONE" };    
  } else {
    return { errorCode: "INVALID_CREDENTIALS" };
  }
};

/**
* validate user credentials.
*/
function validateCredentials(token) {
  const rawResponse = UrlFetchApp.fetch(globalVar.urlBase + 'myself', {
      method: 'GET',
      headers: {'Authorization': 'Basic ' + token, 'Content-Type': 'application/json'},
      muteHttpExceptions: true});
  
  if (rawResponse.getResponseCode() === 200)    
    return true;       
  return false;
}

/**
* display all details when error occurs.
*/
function isAdminUser() {
  return true;
}


