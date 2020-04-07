const languages = [
  {
    id: "1",
    iso: "en",
    name: "english",
    direction: "ltr"
  },
  {
    id: "2",
    iso: "ar",
    name: "arabic",
    direction: "rtl"
  }
];

export default {
  getAll: () => (languages),
  getByLanguageString: (language) => languages.find((obj) => obj.name === language)
};
