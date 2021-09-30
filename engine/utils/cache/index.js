const cache = new Map();

async function getCachedValue(cacheKey, valueGetter, ...args) {
  const cachedValue = cache.get(cacheKey);
  if (cachedValue !== undefined) {
    return cachedValue;
  } else {
    return (
      Promise.resolve(valueGetter.apply(this, args))
        .then((value) => {
          if (value !== undefined) {
            cache.set(cacheKey, value);
          }
          return value;
        })
    );
  }
}

module.exports = getCachedValue;
