import { configure, addDecorator } from '@storybook/react';
import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { withOptions } from '@storybook/addon-options';
import CenteredAddon from "@storybook/addon-centered";
import { withBackgrounds } from '@storybook/addon-backgrounds';
import { withConsole } from '@storybook/addon-console';

const req = require.context('../stories', true, /\.story\.tsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}


// ========================= Viewports setup starts ===================
const newViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px'
    }
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px'
    }
  }
};

configureViewport({
  defaultViewport: 'iphone5',
  viewports: {
    ...INITIAL_VIEWPORTS,
    ...newViewports
  }
});


// ========================= Options starts ===================
addDecorator(
  withOptions({
    name: "RedMart Self-Service v3",
    url: "https://redmart-help.lazada.sg",
    showStoriesPanel: true,
    showAddonPanel: true,
    showSearchBox: false,
    addonPanelInRight: true
  })
);


addDecorator(withKnobs);
addDecorator(withNotes);
addDecorator(CenteredAddon);
addDecorator(withBackgrounds([
  { name: 'light-grey', value: '#f8f8f8', default: true },
  { name: 'whilte', value: '#fff' },
  { name: 'overlay-background', value: '#666' },
  { name: 'transparent', value: 'transparent' }
]));
addDecorator((storyFn, context) => withConsole()(storyFn)(context));


configure(loadStories, module);