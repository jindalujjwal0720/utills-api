import { toPng } from "html-to-image";
// import { saveAs } from "file-saver";

/**
 * Convert html element to image and save it to the given filepath
 * @param {} element
 * @param {String} filepath
 */
export const htmlToImage = async (element, filepath) => {
  const dataUrl = await toPng(element);
//   saveAs(dataUrl, filepath);
  return dataUrl;
};
