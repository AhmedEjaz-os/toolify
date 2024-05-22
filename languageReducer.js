const initialState = {
    language: 'en', // Default language
  };
  
  const languageReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'TOGGLE_LANGUAGE':
        return {
          ...state,
          language: state.language === 'en' ? 'ar' : 'en',
        };
      default:
        return state;
    }
  };
  
  export default languageReducer;
  