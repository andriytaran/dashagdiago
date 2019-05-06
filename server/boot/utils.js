const format = (value) => {

  if (value) {
    return value;
  }

  if ([null, undefined].includes(value)) {
    return '';
  }

  return value;
};

module.exports = {
  format,
};
