export default (text: string | undefined) => {
  if (!text || !text.trim()) throw new Error(`text is invalid`);
  return text as string;
};
