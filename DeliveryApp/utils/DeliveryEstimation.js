export function estimateDelivery(provider, currentTime, pincodeType) {
    if (provider === 'Provider A') {
      return currentTime.getHours() < 17 ? 'Same-day' : 'Next-day';
    } else if (provider === 'Provider B') {
      return currentTime.getHours() < 9 ? 'Same-day' : 'Next-day';
    } else {
      // General Partners
      switch (pincodeType) {
        case 'metro':
          return '2 days';
        case 'non-metro':
          return '3 days';
        default:
          return '5 days';
      }
    }
  }
  