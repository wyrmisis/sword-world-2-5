import './sw-tag/sw-tag';
import './sw-card/sw-card';
import './sw-power-grid/sw-power-grid';

// The below imports are Form Associated Custom Elements
// While they work, they make using the keyboard to navigate
// the UI difficult.
// We'll keep them in the repo and down here to remember to
// put them to work once Core has better support for custom elements!
// import './sw-meter/sw-meter';
// import './sw-input/sw-input';
// import './sw-select/sw-select';
// import './sw-switch/sw-switch';

import './sw-weapon-card/sw-weapon-card';
import './sw-armor-card/sw-armor-card';

import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
