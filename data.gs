function createData(request) {  
  //get config parameters
  const params = createQueryParamsFromConfig(request);      
  //get token from input user
  const token = loadCurrentUser();
  //get jql sentence with params filters
  const jql = getJQL(params);  
  //create response with connector format required.
  const fields = this.getFields(); 
  const fieldIds = request.fields.map(function(field) {
    return field.name;
  });       
  //get issues.
  const issues = getIssues(token, jql);
  const requestedSchema = fields.forIds(fieldIds);    
  //transform response.
  const requestedData = transform(token, requestedSchema, issues);      
  
  return {
    schema: requestedSchema.build(),
    rows: requestedData
  };
}

/**
* transform list of issues in the response with connector format
* @return {array}.
*/
function transform(token, requestedSchema, issues) {
  const schema = requestedSchema.asArray();
  var issuesInBackLog = undefined;
  var releases = [];  
  
  const data = issues.map(function(issue) {
    const histories = issue.changelog.histories? issue.changelog.histories: [];        
    const fields = issue.versionedRepresentations;            
    const sprints = fields[globalVar.sprint]? fields[globalVar.sprint].firstProp(): [];        
    const project = fields.project? fields.project.firstProp(): undefined;           
    const lastAssigneeUser = fields.assignee? fields.assignee.firstProp()? fields.assignee.firstProp().displayName: '': '';    
    const storyPoints = fields[globalVar.storyPoints]? fields[globalVar.storyPoints].firstProp(): 0;     
    const assigneeUsers = getAssigneeUsers(histories);    
    const sprint = getSprint(sprints);       
    const values = [];        
    
    if (project) {    
      //add release info to project
      var release = releases.find(function (item) {
        return item.key == project.key;
      });    
      if (!release) {
        release = getReleaseProject(project, token);               
        releases.push(release);
      }
      project.releaseName = release.name;
      project.releaseDate = release.date;        
      project.released = release.released;
    }
    
    if (sprints && sprint) {  
      //add custom info to issue
      if (!issuesInBackLog) 
        issuesInBackLog = getIssuesInBacklog(token, sprint.boardId);      
      issue.backlog = arrayContains(issuesInBackLog, issue.key);
      issue.extend = (sprints.length > 1)? true: false;
    } else {
      issue.backlog = false;
      issue.extend = false;      
    }
    
    
    schema.forEach(function(reqField) {          
      switch (reqField.getId()) {                
        case 'key':
          values.push(issue.key);
          break;        
        case 'extend':
          values.push(issue.extend);
          break;
        case 'backlog':
          values.push(issue.backlog);
          break;
        case 'storyPoints':
          values.push(storyPoints);
          break;
        case 'lastAssignee':    
          values.push(lastAssigneeUser);          
          break;
        case 'assignee':    
          values.push(assigneeUsers);
          break;
        case 'summary':
          (fields.summary)? values.push(fields.summary.firstProp()): values.push('');
          break;        
        case 'type':
          (fields.issuetype)? values.push(fields.issuetype.firstProp().name): values.push('');
          break;       
        case 'state':
          (fields.status)? values.push(fields.status.firstProp().name): values.push('');           
          break;
        case 'priority':
          (fields.priority)? values.push(fields.priority.firstProp().name): values.push('');           
          break;
        case 'created_hide':          
          (fields.created)? values.push(fields.created.firstProp()): values.push('');                          
          break;
        case 'created':          
          (fields.created)? values.push(fields.created.firstProp()): values.push('');                                        
          break;
        case 'resolution_hide':
          (fields.resolutiondate)? values.push(fields.resolutiondate.firstProp()): values.push('');                                    
          break;
        case 'resolution':
          (fields.resolutiondate)? values.push(fields.resolutiondate.firstProp()): values.push('');
          break;        
        case 'projectKey':
          (project)? values.push(project.key): values.push('');
          break;
        case 'projectName':
          (project)? values.push(project.name): values.push('');          
          break;
        case 'projectReleaseName':
          (project)? values.push(project.releaseName): values.push('');                    
          break;
        case 'projectReleased':
          (project)? values.push(project.released): values.push('');                    
          break;
        case 'projectReleaseDate_hide':
          (project)? values.push(project.releaseDate): values.push('');                              
          break;
        case 'projectReleaseDate':
          (project)? values.push(project.releaseDate): values.push('');                              
          break;
        case 'sprintName':
          (sprint)? values.push(sprint.name): values.push('');                              
          break;
        case 'sprintState':
          (sprint)? values.push(sprint.state): values.push('');          
          break;
        case 'sprintStart_hide':
          (sprint)? values.push(sprint.startDate): values.push('');      
          break;
        case 'sprintStart':
          (sprint)? values.push(sprint.startDate): values.push('');          
          break;
        case 'sprintEnd_hide':
          (sprint)? values.push(sprint.endDate): values.push('');          
          break;          
        case 'sprintEnd':
          (sprint)? values.push(sprint.endDate): values.push('');          
          break;
        case 'sprintComplete_hide':
          (sprint)? values.push(sprint.completeDate): values.push('');          
          break;          
        case 'sprintComplete':
          (sprint)? values.push(sprint.completeDate): values.push('');          
          break;          
        case 'assigneedSprints':    
          (sprint)? values.push(sprint.track): values.push('');
          break;
        default:
          values.push('');
          break;
      }
    });
    return {
      values: values
    };
  });    
  return data;
}

/**
* Get JQL sentece, filter for created an project attributes from issue
* @return {array}.
*/
function getJQL(params) {
  const dateEnd = new Date(params.dateEnd.getFullYear(), params.dateEnd.getMonth(), params.dateEnd.getDate() + 1);      
  const dateStart = params.dateStart;
  const projects = params.projects;
  const start = dateStart.toISOString().slice(0,10);
  const end = dateEnd.toISOString().slice(0,10);
  var jql = []; 

  jql.push("created >= '" + start + "'");  
  jql.push("AND");
  jql.push("created < '" + end + "'");  
  jql.push("AND");       
  jql.push("project IN (" + projects + ")");           
  jql.push("ORDER BY created DESC"); 
  
  const query = jql.join(" ");  
  return query;
}

/**
* Get list of issues
* @return {array}.
*/
function getIssues(token, jql, offset) {  
  const startAt = (offset)? offset: 0;  
  const rawResponse = UrlFetchApp.fetch(globalVar.urlBase + 'search', {
      method: 'POST',      
      headers: {'Authorization': 'Basic ' + token, 'Content-Type': 'application/json'},
      muteHttpExceptions: true,                          
      payload: JSON.stringify({
        "expand": ["names", "versionedRepresentations", "changelog"],
        "jql": jql,
        "maxResults": 5000,
        "fieldsByKeys": false,        
        "fields": [globalVar.sprint, globalVar.storyPoints, "status", "summary", "assignee", "project", "issuetype", "resolutiondate", "created", "priority"],
        "startAt": startAt})                                      
  });
  const httpCode = rawResponse.getResponseCode();    

  if (httpCode === 200) {       
    const res = JSON.parse(rawResponse);  
    const issues = res.issues;      
    const readedAt = startAt + issues.length - 1;          
    
    if (readedAt < (res.total - 1)) {
      //the answer is paginated
      const next = getIssues(token, jql, readedAt + 1);      
      return issues.concat(next);
    }    
    return issues;
  }  
  return []; 
}

/**
* Get data from the release project
* @return {object}.
*/
function getReleaseProject(project, token) {   
  const rawResponse = UrlFetchApp.fetch(globalVar.urlBase + 'project/' + project.key, {
        method: 'GET',      
        headers: {'Authorization': 'Basic ' + token, 'Content-Type': 'application/json'},
        muteHttpExceptions: true
  });
  const httpCode = rawResponse.getResponseCode();    
  
  if (httpCode === 200) {       
    const res = JSON.parse(rawResponse);  
    var lastVersion = undefined;
    var lastDate = undefined;
    
    for (i = res.versions.length - 1;i >= 0; i--) {
      const version = res.versions[i];
      if (version.releaseDate) {
        const date = parseISOString(version.releaseDate);
        if (!lastDate || lastDate < date) {
          lastVersion = version;
          lastDate = date;          
        }
      }       
    }        
  } 
  
  if (lastVersion)
    return {key: project.key, name: lastVersion.name, date: lastVersion.releaseDate, released: lastVersion.released};       
  
  //the project hasn´t release 
  return {key: project.key, name: '', date: '', released: false};
}

/**
* Get list of issues inside on backlog
* @return {array} with key of issues in backlog.
*/
function getIssuesInBacklog(token, boardId, offset) {      
  const startAt = (offset)? offset: 0;  
  const rawResponse = UrlFetchApp.fetch(globalVar.urlBaseAgile + 'board/' + boardId + '/backlog?startAt=' + startAt, {
      method: 'GET',      
      headers: {'Authorization': 'Basic ' + token, 'Content-Type': 'application/json'},
      muteHttpExceptions: true
  });
  const httpCode = rawResponse.getResponseCode();
  var result = [];  

  if (httpCode === 200) {       
    const res = JSON.parse(rawResponse); 
    const readedAt = startAt + res.issues.length - 1;       
    
    res.issues.forEach(function(issue) {
      result.push(issue.key);      
    });  
    if (readedAt < (res.total - 1)) {
      //the answer is paginated
      const next = getIssuesInBacklog(token, boardId, readedAt + 1);      
      result = result.concat(next);
    }
  } 
  return result;
}

/**
* Get last assigned sprint to issue
* @return {object} with sprint data.
*/
function getSprint(sprints) {
  var lastDate = undefined;     
  var sprint = undefined; 
  var track = [];  
  
  if (sprints && sprints.length > 0) {      
    sprints.forEach(function(item){
      const date = parseISOString(item.startDate);                        
      if (date && (!lastDate || lastDate < date)) {                        
        lastDate = date;         
        sprint = item;           
      } 
      // track of sprint names
      addToStringArray(track, item.name);        
    });  
    if (sprint)
      sprint.track = (track.length > 0)? track.join(', '):  sprint.track = ''; 
  }  
  return sprint; 
}

/**
* Get list of assigned users to issue
* @return {string} with names.
*/
function getAssigneeUsers(histories) {
  var result = '';
  
  if (histories) {   
    const arr = [];
    histories.forEach(function(history){
      history.items.forEach(function(item){
        if (item.fieldId == item.field && item.field == 'assignee')           
          addToStringArray(arr, item.toString);                  
      });
      if (arr.length > 0) 
        result = arr.join(', ');      
    });      
  }
  return result;
}