import html2canvas from "html2canvas";

export const htmlToCanvas = async (element) => {
  console.log(element);
  return html2canvas(element, {
    allowTaint: true,
    useCORS: true,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
  }).then(function (canvas) {
    return canvas;
  });
};

export const htmlToCanvasImage = async (element) => {
  console.log(element);
  return html2canvas(element, {
    allowTaint: true,
    useCORS: true,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
  }).then(function (canvas) {
    var img = canvas.toDataURL("image/png");
    return img;
  });
};