import { FontAwesomeIcon, IconDefinition } from '@fortawesome/vue-fontawesome'
import { 
    faXmark, faGear, faArrowsUpToLine, faArrowsDownToLine, 
    faBold, faItalic, faStrikethrough, faLink,
    faMinus, faListUl, faListOl, faListCheck,
    faCode, faMessage, faSquareRootVariable, faAlignLeft,
    faAlignRight, faMaximize, faImage, faInfo,
    faTable, faQuoteLeft, faQuestion,
 } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const defaultIcons: Record<string, IconDefinition> = {
    'xmark': faXmark,
    'config': faGear,
    'headingup': faArrowsUpToLine,
    'headingdown': faArrowsDownToLine,
    'bold': faBold,
    'italic': faItalic,
    'strikethrough': faStrikethrough,
    'link': faLink,
    'line': faMinus,
    'listul': faListUl,
    'listol': faListOl,
    'listtask': faListCheck,
    'code': faCode,
    'block': faMessage,
    'math': faSquareRootVariable,
    'editor': faAlignLeft,
    'viewer': faAlignRight,
    'expand': faMaximize,
    'info': faInfo,
    'picture': faImage,
    'table': faTable,
    'quote': faQuoteLeft,
    'help': faQuestion,
    'github': faGithub,
}

export { FontAwesomeIcon, defaultIcons };