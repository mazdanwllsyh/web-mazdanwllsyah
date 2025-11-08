export const transformCloudinaryUrl = (url, width = 480, height = 480) => {
  if (!url || typeof url !== "string") return "";

  if (!url.includes("res.cloudinary.com")) return url;

  const regex = /\/upload(\/|$)/;
  const hasUpload = regex.test(url);

  const transform = `upload/w_${width},h_${height},c_fill,q_auto,f_auto`;

  if (hasUpload) {
    return url.replace(/\/upload\/?/, `/${transform}/`);
  }

  return `${url}/${transform}`;
};
