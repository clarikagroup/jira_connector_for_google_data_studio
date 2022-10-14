function getAuthType() {      
  const cc = DataStudioApp.createCommunityConnector();  
  return cc.newAuthTypeResponse()
    .setAuthType(cc.AuthType.PATH_USER_PASS)    
    .build();
}

function getConfig(request) {    
  return createConfig();
}

function getSchema(request) {      
  return createSchema(request);
}

function getData(request) {  
  return createData(request);
}