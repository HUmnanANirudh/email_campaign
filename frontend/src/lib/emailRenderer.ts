export const renderEmailPreview = (template: string, data: Record<string, string>): string => {
  let result = template
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    // specific styling for name to match requirements (bold, indigo)
    if (key === 'name') {
        result = result.replace(regex, `<span class="font-bold text-indigo-600">${data[key]}</span>`);
    } else {
        result = result.replace(regex, `<span class="font-bold text-foreground">${data[key]}</span>`);
    }
  });

  return result;
};
