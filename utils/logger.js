
function logInfo(message, data) {
    console.log('[INFO]', message, data || '');
  }
  
  function logError(message, error) {
    console.error('[ERROR]', message, error || '');
  }
  
  module.exports = {
    info: logInfo,
    error: logError,
  };
  