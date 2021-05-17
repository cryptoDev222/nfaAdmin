import { createMuiTheme } from '@material-ui/core/styles'
import * as MuiLocaleInstances from '@material-ui/core/locale'
import { LOCALES } from '../config/constants'

export const createLocalizedTheme = (outerTheme, language) =>
	createMuiTheme(outerTheme, MuiLocaleInstances[LOCALES[language]])
