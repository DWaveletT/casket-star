import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
    faXmark, faGear, faBold, faItalic,
    faStrikethrough, faLink, faMinus, faListUl,
    faListOl, faListCheck, faCode, faMessage,
    faSquareRootVariable, faArrowsMaximize, faImage, faInfo,
    faTable, faQuoteLeft, faQuestion,
} from '@fortawesome/pro-regular-svg-icons';
import { faLeftExpandRegular, faRegularHeadingCircleArrowDown, faRegularHeadingCircleArrowUp, faRightExpandRegular } from '@awesome.me/kit-336dcd0b68/icons/kit/custom';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const defaultIcons: Record<string, IconDefinition> = {
    'xmark': faXmark,
    'config': faGear,
    'headingup': faRegularHeadingCircleArrowUp,
    'headingdown': faRegularHeadingCircleArrowDown,
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
    'editor': faLeftExpandRegular,
    'viewer': faRightExpandRegular,
    'expand': faArrowsMaximize,
    'info': faInfo,
    'image': faImage,
    'table': faTable,
    'quote': faQuoteLeft,
    'help': faQuestion,
};

export { FontAwesomeIcon, defaultIcons };