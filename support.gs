Object.prototype.firstProp = function(){
    return this[Object.keys(this)[0]]     
};

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

String.prototype.replaceAll = function (find, replace) {  
  return this.replace(new RegExp(find, 'g'), replace);  
}

String.prototype.toDate = function(format)
{
  const normalized       = this.replace(/[^a-zA-Z0-9]/g, '-');
  const normalizedFormat = format.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  const formatItems      = normalizedFormat.split('-');
  const dateItems        = normalized.split('-');
  const monthIndex  = formatItems.indexOf("mm");
  const dayIndex    = formatItems.indexOf("dd");
  const yearIndex   = formatItems.indexOf("yyyy");  

  if (yearIndex > -1 && monthIndex > -1 && monthIndex > -1) {
    const year  = dateItems[yearIndex];
    const month = dateItems[monthIndex];
    const day   = dateItems[dayIndex];
    
    return new Date(year, month - 1, day);
  }
  return NaN;
};

function parseISOString(str) {
  if (str && str.length > 0) {
     var b = str.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }
  return undefined;
}

function arrayContains(arr, item)
{
    return (arr.indexOf(item) > -1);
}

function addToStringArray(arr, item)
{
  if (arr.indexOf(item) < 0) 
    arr.push(item);    
}

function setGlobalVars() {
  const scriptProps = PropertiesService.getScriptProperties();  
  const domain  = scriptProps.getProperty('DEFAULT_DOMAIN').toLowerCase();  
  const formatDate  = scriptProps.getProperty('FORMAT_DATE').toLowerCase();   
  const lang  = scriptProps.getProperty('LANG');       
  
  globalThis.globalVar = {};
  globalVar.domain = domain;  
  globalVar.urlBase = 'https://' + domain + '.atlassian.net/rest/api/3/';
  globalVar.urlBaseAgile = 'https://' + domain + '.atlassian.net/rest/agile/1.0/';  
  globalVar.lang = lang;
  globalVar.date = {format: {year: "numeric", month: "2-digit", day: "2-digit"}, input: formatDate};   
  globalVar.httpHeaders = undefined;
  globalVar.params = undefined;
}

