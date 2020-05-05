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
  },
  {
    id: "3",
    iso: "sp",
    name: "spanish",
    direction: "ltr"
  },
  {
    id: "4",
    iso: "so",
    name: "somali",
    direction: "ltr"
  },
  {
    id: "5",
    iso: "tr",
    name: "turkish",
    direction: "ltr"
  },
  {
    id: "6", 
    iso: "am",
    name: "amharic",
    direction: "ltr"
  }
];

export default {
  getAll: () => (languages),
  getByLanguageString: (language) => languages.find((obj) => obj.name === language)
};
