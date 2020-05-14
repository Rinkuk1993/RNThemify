import React, {useState, useContext, useEffect} from 'react';
import THEMES from './themes.json';
import AsyncStorage from '@react-native-community/async-storage';

export const ThemeContext = React.createContext();
const STORAGE_KEY = 'THEME_ID';

export const ThemeContextProvider = ({children}) => {
  const [themeID, setThemeID] = useState(THEMES[1].key);

  useEffect(() => {
    (async () => {
      const storedThemeID = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedThemeID) {
        setThemeID(storedThemeID);
      } else {
        setThemeID(THEMES[1].key);
      }
    })();
  }, []);

  return (
    <ThemeContext.Provider value={{themeID, setThemeID}}>
      {children}
    </ThemeContext.Provider>
  );
};

export function withTheme(Component) {
  return props => {
    const {themeID, setThemeID} = useContext(ThemeContext);

    const getTheme = themeID => THEMES.find(theme => theme.key === themeID);
    const setTheme = themeID => {
      AsyncStorage.setItem(STORAGE_KEY, themeID);
      setThemeID(themeID);
    };

    return (
      <Component
        {...props}
        themes={THEMES}
        theme={getTheme(themeID)}
        setTheme={setTheme}
      />
    );
  };
}
