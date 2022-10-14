function createSchema(request) {
  setGlobalParams();
  validateParamsFromConfig(request);
  return { schema: getFields(request).build() };  
}

function getFields(request) {
  const cc = DataStudioApp.createCommunityConnector();
  const fields = cc.getFields();
  const types = cc.FieldType;  
  const aggregations = cc.AggregationType;
  
  fields.newDimension()
  .setId('key')
  .setName('Key')  
  .setDescription('Issue key')
  .setGroup('Issue')
  .setType(types.TEXT);  
  
  fields.newDimension()
  .setId('summary')
  .setName('Summary')   
  .setDescription('Issue summary')
  .setGroup('Issue')
  .setType(types.TEXT);  
  
  fields.newDimension()
  .setId('assignee')
  .setName('Users Assignee')  
  .setDescription('Issue users')
  .setGroup('Issue')
  .setType(types.TEXT);
  
  fields.newDimension()
  .setId('lastAssignee')
  .setName('Last User Assignee')  
  .setDescription('Issue last user assignee')
  .setGroup('Issue')
  .setType(types.TEXT);  
  
  fields.newDimension()
  .setId('type')
  .setName('Type')  
  .setDescription('Issue type')
  .setGroup('Issue')
  .setType(types.TEXT); 
  
  fields.newDimension()
  .setId('state')
  .setName('State')
  .setDescription('Issue state')
  .setGroup('Issue')
  .setType(types.TEXT);
  
  fields.newDimension()
  .setId('priority')
  .setName('Priority')
  .setDescription('Issue priority')
  .setGroup('Issue')
  .setType(types.TEXT);
  
  fields.newDimension()
  .setId('created_hide')        
  .setType(types.TEXT)
  .setGroup('Issue')
  .setIsHidden(true);  
  
  fields.newDimension()
  .setId('created')
  .setName('Created')     
  .setDescription('Issue created date')
  .setFormula('IF(LENGTH(IFNULL($created_hide,"")) > 10, TODATE(SUBSTR($created_hide,1,10),"%Y-%m-%d","%Y%m%d"), NULL)')  
  .setGroup('Issue')
  .setType(types.YEAR_MONTH_DAY);  
  
  fields.newDimension()
  .setId('resolution_hide')        
  .setType(types.TEXT)
  .setGroup('Issue')
  .setIsHidden(true);  
  
  fields.newDimension()
  .setId('resolution')
  .setName('Resolution')   
  .setDescription('Issue resolution date')
  .setGroup('Issue')
  .setFormula('IF(LENGTH(IFNULL($resolution_hide,"")) > 10, TODATE(SUBSTR($resolution_hide,1,10),"%Y-%m-%d","%Y%m%d"), NULL)')  
  .setType(types.YEAR_MONTH_DAY);  
  
  fields.newMetric()
  .setId('storyPoints')
  .setName('Story Points')   
  .setDescription('Issue story points')
  .setGroup('Issue')  
  .setType(types.NUMBER);

  fields.newMetric()
  .setId('extend')
  .setName('Extend')   
  .setDescription('Issue sent to other sprints')
  .setGroup('Issue')  
  .setType(types.BOOLEAN);
  
  fields.newMetric()
  .setId('backlog')
  .setName('In Backlog')   
  .setDescription('Issue in backlog now')
  .setGroup('Issue')  
  .setType(types.BOOLEAN);
  
  fields.newDimension()
  .setId('projectKey')
  .setName('Project Key')   
  .setDescription('Project Key')
  .setGroup('Project')
  .setType(types.TEXT);
  
  fields.newDimension()
  .setId('projectName')
  .setName('Project Name')   
  .setDescription('Project name')
  .setGroup('Project')
  .setType(types.TEXT);  
  
  fields.newDimension()
  .setId('projectReleaseName')
  .setName('Project Release Name')   
  .setDescription('Project release number or name')
  .setGroup('Project')
  .setType(types.TEXT);
  
  fields.newDimension()
  .setId('projectReleased')
  .setName('Project Released')   
  .setDescription('Project released')
  .setGroup('Project')
  .setType(types.BOOLEAN);
  
   fields.newDimension()
  .setId('projectReleaseDate_hide')        
  .setType(types.TEXT)
  .setGroup('Project')
  .setIsHidden(true);  
  
  fields.newDimension()
  .setId('projectReleaseDate')
  .setName('Project Release Date')   
  .setDescription('Project released date')
  .setGroup('Project')
  .setFormula('IF(LENGTH(IFNULL($projectReleaseDate_hide,"")) > 0, TODATE($projectReleaseDate_hide,"%Y-%m-%d","%Y%m%d"), NULL)')  
  .setType(types.YEAR_MONTH_DAY);  
  
  fields.newDimension()
  .setId('sprintName')
  .setName('Sprint Name')   
  .setDescription('Sprint name')
  .setGroup('Sprint')
  .setType(types.TEXT);  
  
   fields.newDimension()
  .setId('sprintState')
  .setName('Sprint State')   
  .setDescription('Sprint state')
  .setGroup('Sprint')
  .setType(types.TEXT);  
  
   fields.newDimension()
  .setId('sprintStart_hide')        
  .setType(types.TEXT)
  .setGroup('Sprint')
  .setIsHidden(true);  
  
  fields.newDimension()
  .setId('sprintStart')
  .setName('Sprint Start')       
  .setDescription('Sprint start date')
  .setFormula('IF(LENGTH(IFNULL($sprintStart_hide,"")) > 10, TODATE(SUBSTR($sprintStart_hide,1,10),"%Y-%m-%d","%Y%m%d"), NULL)')  
  .setGroup('Sprint')
  .setType(types.YEAR_MONTH_DAY);  
  
  fields.newDimension()
  .setId('sprintEnd_hide')        
  .setType(types.TEXT)
  .setGroup('Sprint')
  .setIsHidden(true);  
  
  fields.newDimension()
  .setId('sprintEnd')
  .setName('Sprint End')     
  .setDescription('Sprint end date')
  .setFormula('IF(LENGTH(IFNULL($sprintEnd_hide,"")) > 10, TODATE(SUBSTR($sprintEnd_hide,1,10),"%Y-%m-%d","%Y%m%d"), NULL)')  
  .setGroup('Sprint')
  .setType(types.YEAR_MONTH_DAY);    
  
  fields.newDimension()
  .setId('sprintComplete_hide')        
  .setType(types.TEXT)
  .setGroup('Sprint')
  .setIsHidden(true);  
  
  fields.newDimension()
  .setId('sprintComplete')
  .setName('Sprint Complete')     
  .setDescription('Sprint complete date')
  .setFormula('IF(LENGTH(IFNULL($sprintComplete_hide,"")) > 10, TODATE(SUBSTR($sprintComplete_hide,1,10),"%Y-%m-%d","%Y%m%d"), NULL)')  
  .setGroup('Sprint')
  .setType(types.YEAR_MONTH_DAY);  

  fields.newDimension()
  .setId('assigneedSprints')
  .setName('Sprint Names Assigneed')  
  .setDescription('Sprints of Issue')
  .setGroup('Sprint')
  .setType(types.TEXT);  
  
   return fields;
}
