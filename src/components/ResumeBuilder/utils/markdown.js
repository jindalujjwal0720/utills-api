export const getSafeMarkdownString = (str) => {
  if (!str) return "";
  if (typeof str !== "string") return str;
  // escape html
  str = str.replace(/<[^>]*>?/gm, "");
  str = str.replace(/&nbsp;/g, " ");

  // bold and italic
  str = str.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
  str = str.replace(/_(.*?)_/g, "<em>$1</em>");

  return str;
};
