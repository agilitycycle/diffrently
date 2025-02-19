const isImageValid = (imageUrl) => {
  return new Promise(resolve => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
  });
}