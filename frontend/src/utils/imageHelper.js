export const transformCloudinaryUrl = (url, width, height) => {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url; 
  }

  const transform = `upload/w_${width},h_${height},c_fill,q_auto`;

  return url.replace("/upload/", `/${transform}/`);
};
