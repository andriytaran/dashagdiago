const format = (value) => {

  if (value) {
    return value;
  }

  if ([null, undefined].includes(value)) {
    return '';
  }

  return value;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = {
  format,
  capitalizeFirstLetter,
};
