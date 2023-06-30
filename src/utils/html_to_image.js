import { toPng } from "html-to-image";
// import { saveAs } from "file-saver";

/**
 * Convert html element to image and save it with given filename
 * @param {} element
 * @param {String} filepath
 */
export const htmlToImage = async (element, filename) => {
  const dataUrl = await toPng(element);
  return dataUrl;
};
