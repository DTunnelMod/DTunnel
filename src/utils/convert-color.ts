export const ConvertToHexAARRGGBB = (hex: string) => {
  const red = hex.substring(1, 3);
  const green = hex.substring(3, 5);
  const blue = hex.substring(5, 7);
  const alpha = hex.substring(7, 9);
  const newHex = `#${alpha}${red}${green}${blue}`;
  return newHex;
};

export const ConvertFromHexAARRGGBB = (hex: string) => {
  const alpha = hex.substring(1, 3);
  const red = hex.substring(3, 5);
  const green = hex.substring(5, 7);
  const blue = hex.substring(7, 9);
  const originalHex = `#${red}${green}${blue}${alpha}`;
  return originalHex;
};
