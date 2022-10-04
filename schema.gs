function createSchema(request) {
  if (createQueryParamsFromConfig(request)) {
    const fields = getFields(request).build();
    return { schema: fields };
  }
  return { schema: undefined };
}

function getFields(request) {
  const cc = DataStudioApp.createCommunityConnector();
  const fields = cc.getFields();
  const types = cc.FieldType;  
  const aggregations = cc.AggregationType;
  
  fields.newDimension()
  .setId('key')
  .setName('Key')  
  .setGroup('Issue')
  .setType(types.TEXT);  
  
  fields.newDimension()
  .setId('summary')
  .setName('Summary')   
  .setGroup('Issue')
  .setType(types.TEXT);  
  
  fields.newDimension()
  .setId('assignee')
  .setName('Users Assignee')  
  .setGroup('Issue')
  .setType(types.TEXT);
  
  fields.newDimension()
  .setId('lastAssignee')
  .setName('Last User Assignee')  
  .setGroup('Issue')
  .setType(types.TEXT);  
  
  fields.newDimension()
  .setId('type')
  .setName('Type')  
  .setGroup('Issue')
  .setType(types.TEXT); 
  
  fields.newDimension()
  .setId('state')
  .setName('State')
  .setGroup('Issue')
  .setType(types.TEXT);
  
  fields.newDimension()
  .setId('priority')
  .setName('Priority')
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
  .setGroup('Issue')
  .setFormula('IF(LENGTH(IFNULL($resolution_hide,"")) > 10, TODATE(SUBSTR($resolution_hide,1,10),"%Y-%m-%d","%Y%m%d"), NULL)')  
  .setType(types.YEAR_MONTH_DAY);  
  
  fields.newMetric()
  .setId('storyPoints')
  .setName('Story Points')   
  .setGroup('Issue')  
  .setType(types.NUMBER);

  fields.newMetric()
  .setId('extend')
  .setName('Extend')   
  .setGroup('Issue')  
  .setType(types.BOOLEAN);
  
  fields.newMetric()
  .setId('backlog')
  .setName('In Backlog')   
  .setGroup('Issue')  
  .setType(types.BOOLEAN);
  
  fields.newDimension()
  .setId('projectKey')
  .setName('Project Key')   
  .setGroup('Project')
  .setType(types.TEXT);
  
  fields.newDimension()
  .setId('projectName')
  .setName('Project Name')   
  .setGroup('Project')
  .setType(types.TEXT);  
  
  fields.newDimension()
  .setId('projectReleaseName')
  .setName('Project Release Name')   
  .setGroup('Project')
  .setType(types.TEXT);
  
  fields.newDimension()
  .setId('projectReleased')
  .setName('Project Released')   
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
  .setGroup('Project')
  .setFormula('IF(LENGTH(IFNULL($projectReleaseDate_hide,"")) > 0, TODATE($projectReleaseDate_hide,"%Y-%m-%d","%Y%m%d"), NULL)')  
  .setType(types.YEAR_MONTH_DAY);  
  
  fields.newDimension()
  .setId('sprintName')
  .setName('Sprint Name')   
  .setGroup('Sprint')
  .setType(types.TEXT);  
  
   fields.newDimension()
  .setId('sprintState')
  .setName('Sprint State')   
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
  .setFormula('IF(LENGTH(IFNULL($sprintComplete_hide,"")) > 10, TODATE(SUBSTR($sprintComplete_hide,1,10),"%Y-%m-%d","%Y%m%d"), NULL)')  
  .setGroup('Sprint')
  .setType(types.YEAR_MONTH_DAY);  

  fields.newDimension()
  .setId('assigneedSprints')
  .setName('Sprint Names Assigneed')  
  .setGroup('Sprint')
  .setType(types.TEXT);  
  
   return fields;
}


