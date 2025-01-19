// start: coin market cap

function formatPrice(price) {
    return parseFloat(price).toFixed(4); // Fiyatı kısaltma
  }
  
  function formatVolume(volume) {
    const formattedVolume = parseFloat(volume).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formattedVolume;
  }
  
  function formatChange(change) {
    const formattedChange = parseFloat(change).toFixed(2);
    return (formattedChange > 0) ? `+${formattedChange}` : formattedChange;
  }
  
  function formatMarketCap(marketCap) {
    const formattedMarketCap = parseFloat(marketCap).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formattedMarketCap;
  }
  
  module.exports = {
    formatPrice,
    formatVolume,
    formatChange,
    formatMarketCap
  };
  

// end: coin martket cap