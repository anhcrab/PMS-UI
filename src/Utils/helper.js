export const extractModuleFilename = (fullname = '') => {
  const tokens = fullname.split('\\');
  const fileParts = tokens[tokens.length - 1].split('.');
  const file = {
    prefix: fileParts.length === 2 ? null : fileParts[0],
    name: fileParts.length === 2 ? fileParts[0] : fileParts[1],
    ext: fileParts[fileParts.length - 1],
  }
  return file
}