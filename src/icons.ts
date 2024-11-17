import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { 
    faXmark, faGear, faBold, faItalic,
    faStrikethrough, faLink, faGripLines, faListUl,
    faListOl, faListCheck, faCode, faMessage,
    faSquareRootVariable, faMaximize, faImage, faCircleInfo,
    faTable, faCircleQuestion, faClock,
    faHeading, faAlignLeft, faAlignRight,
    faQuoteLeft
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

// Different from the icons used by Luogu
const defaultIcons: Record<string, IconDefinition> = {
    'xmark': faXmark,
    'config': faGear,
    'headingup': faHeading,
    'headingdown': faHeading,
    'bold': faBold,
    'italic': faItalic,
    'strikethrough': faStrikethrough,
    'link': faLink,
    'line': faGripLines,
    'listul': faListUl,
    'listol': faListOl,
    'listtask': faListCheck,
    'code': faCode,
    'block': faMessage,
    'math': faSquareRootVariable,
    'editor': faAlignLeft,
    'viewer': faAlignRight,
    'expand': faMaximize,
    'info': faCircleInfo,
    'image': faImage,
    'table': faTable,
    'quote': faQuoteLeft,
    'help': faCircleQuestion,
    'autosave': faClock,
};

export { defaultIcons, FontAwesomeIcon };