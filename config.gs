function createConfig() {  
  const cc = DataStudioApp.createCommunityConnector();
  const config = cc.getConfig();
  const projects = getProjects(); 
  const today = new Date();      
  const first = new Date(today.getFullYear(),0,1);      
  var multiple; 
  
  config.newInfo()
  .setId('domain')
  .setText('Default domain is ' + globalVar.domain.toUpperCase());
  
  config.newInfo()
  .setId('range')
  .setText('The maximum range between dates is two years');
  
  config.newTextInput()
  .setId("dateStart")
  .setName("Start Date")
  .setHelpText(globalVar.date.input)
  .setPlaceholder(first.toLocaleDateString(globalVar.lang, globalVar.date.format))
  .setAllowOverride(false);
  
  config.newTextInput()
  .setId("dateEnd")
  .setName("End Date")
  .setHelpText(globalVar.date.input)
  .setPlaceholder(today.toLocaleDateString(globalVar.lang, globalVar.date.format))
  .setAllowOverride(false);
  
  multiple = config.newSelectMultiple()
  .setId("projects")
  .setName("Projects")
  .setHelpText("Select projects you're interested in")  
   projects.forEach(function(row) {
    multiple.addOption(config.newOptionBuilder().setLabel(row.name).setValue(row.key));
  });    
  
  config.setDateRangeRequired(true);
  config.setIsSteppedConfig(false);
  
  return config.build();  
}

/**
* get list of projects from domain.
* @return {array} 
*/
function getProjects() {
  const token = loadCurrentUser();
  const rawResponse = UrlFetchApp.fetch(globalVar.urlBase + 'project', {
      method: 'GET',
      headers: {'Authorization': 'Basic ' + token, 'Content-Type': 'application/json'},
      muteHttpExceptions: true});
  
  const httpCode = rawResponse.getResponseCode();
  
  if (httpCode === 200) {
     return JSON.parse(rawResponse);     
  }
  return [];
}

/**
* Validate config parameteres.
* @return {object} valid input parameters
*/
function createQueryParamsFromConfig(request) {  
  if (request.configParams) {
    const projects = request.configParams.projects? request.configParams.projects: "";
    
    if (projects && projects.length > 0) {                           
      const today = new Date();        
      var dateStart;
      var dateEnd;
      
      if (request.configParams.dateStart) {
        dateStart = request.configParams.dateStart.toString().toDate(globalVar.date.input);
        if (isNaN(dateStart)) 
          throw ("Start date has incorrect format");
      } else {        
        dateStart = new Date(today.getFullYear(), 0, 1);      
      }
      
      if (request.configParams.dateEnd) {
        dateEnd = request.configParams.dateEnd.toString().toDate(globalVar.date.input);
        if (isNaN(dateEnd)) 
          throw ("End date has incorrect format");
      } else {        
        dateEnd = today;      
      }
      
      //the difference between start and end dates must not exceed two years (730 days)
      const diffDays = Math.ceil((dateEnd - dateStart) / (1000 * 60 * 60 * 24));       
      if (diffDays < 0 || dateStart > today || dateEnd > today) { 
        throw ("Range of dates is incorrect");              
      } else if (diffDays > 730) {
        throw ("Range of dates is greater than 730 days");              
      }
      return {projects: projects, dateStart: dateStart, dateEnd: dateEnd};
    }
  }
  throw ("Project is required");    
  return undefined;    
}
