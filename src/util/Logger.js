import LoggerService from '@/service/LoggerService'
// 日志名称
let loggerName = "default";


const debug = (operationTypeCode, response, data) => {
  let loggerService = new LoggerService(operationTypeCode, response, data);
  if(operationTypeCode.indexOf("FT")!=-1){
    loggerService.sendInsuranceTrack()
  }else{
    loggerService.sendLog();
  }
  console.warn("[", loggerName, "]", operationTypeCode, response, data);
};

const info = (operationTypeCode, response, data) => {
  let loggerService = new LoggerService(operationTypeCode, response, data);
  if(operationTypeCode.indexOf("FT")!=-1){
    loggerService.sendInsuranceTrack()
  }else{
    loggerService.sendLog();
  }
  console.log("[", loggerName, "]", operationTypeCode, response, data);
};

const error = (operationTypeCode, response, data) => {
  let loggerService = new LoggerService(operationTypeCode, response, data);
  if(operationTypeCode.indexOf("FT")!=-1){
    loggerService.sendInsuranceTrack()
  }else{
    loggerService.sendLog();
  }
  console.error("[", loggerName, "]", operationTypeCode, response, data);
};

const logger = {
  debug,
  info,
  error
};

export const getLogger = name => {
  if (name) {
    loggerName = name;
  }
  return logger;
};