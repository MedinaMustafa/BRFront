import { library } from "@fortawesome/fontawesome-svg-core";
import { 
  faLink, 
  faPowerOff, 
  faUser, 
  faStar, 
  faHeart, 
  faComment, 
  faComments, 
  faBookOpen, 
  faTag, 
  faBuilding, 
  faCalendar, 
  faFolder, 
  faPlus, 
  faChevronRight, 
  faSpinner, 
  faExclamationTriangle, 
  faInfoCircle,
  faPaperPlane,
  faList,
  faFolderOpen
} from "@fortawesome/free-solid-svg-icons";

function initFontAwesome() {
  library.add(faLink);
  library.add(faUser);
  library.add(faPowerOff);
  library.add(faStar);
  library.add(faHeart);
  library.add(faComment);
  library.add(faComments);
  library.add(faBookOpen);
  library.add(faTag);
  library.add(faBuilding);
  library.add(faCalendar);
  library.add(faFolder);
  library.add(faPlus);
  library.add(faChevronRight);
  library.add(faSpinner);
  library.add(faExclamationTriangle);
  library.add(faInfoCircle);
  library.add(faPaperPlane);
  library.add(faList);
  library.add(faFolderOpen);
}

export default initFontAwesome;
