
//this function is to get resized image from cloudinary for avatar image .

export const getAvatarUrl = (url) => {
  if (!url) return "";

  return url.replace(
    "/upload/",
    "/upload/w_64,h_64,c_fill,q_auto,f_auto/"
  );
};
