/**
* Resets the auth service.
*/
function resetAuth() {
  const properties = PropertiesService.getUserProperties();  
  properties.deleteProperty('dscc.stoken');
  properties.deleteProperty('dscc.domain');
}

/**
* get current user (token) from cache.
*/
function loadCurrentCredential() {   
  const properties = PropertiesService.getUserProperties();  
  const domain = properties.getProperty('dscc.domain'); 
  const token = properties.getProperty('dscc.stoken'); 

  if ((domain && domain.length > 0) && (token && token.length > 0))
    return {'domain': domain, 'token': token}; 
  return undefined
};

/**
* save current user in cache.
*/
function saveCredential(domain, token) {  
  const properties = PropertiesService.getUserProperties();  
  properties.setProperty('dscc.domain', domain);
  properties.setProperty('dscc.stoken', token);
};

/**
* Returns true if the auth service has access.
* @return {boolean} True if the auth service has access.
*/
function isAuthValid() {
  const credential = loadCurrentCredential();  

  if (credential)    
    return validateCredential(credential.domain, credential.token);        
  return false;
};


/**
* get username and password (token) from init form and validate.
*/
function setCredentials(request) {     
  const reqDomain = request.pathUserPass.path;  
  const reqUser = request.pathUserPass.username;  
  const reqToken = request.pathUserPass.password;
  const token = Utilities.base64Encode(reqUser + ':' + reqToken);
  const isValid = validateCredential(reqDomain, token);
  
  if (isValid) {
    saveCredential(reqDomain, token);
    return { errorCode: "NONE" };    
  } else {
    return { errorCode: "INVALID_CREDENTIALS" };
  }
};

/**
* validate user credentials.
*/
function validateCredential(domain, token) {
  const rawResponse = UrlFetchApp.fetch('https://' + domain + '.atlassian.net/rest/api/3/myself', {
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
