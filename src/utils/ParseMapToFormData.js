const ParseMapToFormData = map => {
  // return qs.stringify(map)
  if (typeof map !== 'object') return;
  if (Array.isArray(map)) return;
  const formData = new FormData();
  for (let key in map) {
    formData.append(key, map[key]);
  }
  return formData;
};

export default ParseMapToFormData;
