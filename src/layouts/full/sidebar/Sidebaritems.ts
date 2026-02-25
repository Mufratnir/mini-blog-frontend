export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

import { uniqueId } from 'lodash';

const SidebarContent: MenuItem[] = [
  {
    heading: 'Home',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-add-line-duotone',
        id: uniqueId(),
        url: '/dashboard',
      },
      {
        name: 'Categories',
        icon: 'solar:screencast-2-line-duotone',
        id: uniqueId(),
        url: '/categories',
      },
      {
        name: 'All Users',
        icon: 'solar:chart-line-duotone',
        id: uniqueId(),
        url: '/user',
      },

      {
        name: 'Front Pages',
        id: uniqueId(),
        icon: 'solar:home-angle-linear',
        children: [
          {
            name: 'Homepage',
            id: uniqueId(),
            url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
          },
          {
            name: 'About Us',
            id: uniqueId(),
            url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
          },
          {
            name: 'Blog',
            id: uniqueId(),
            url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/blog',
          },
          {
            name: 'Contact Us',
            id: uniqueId(),
            url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/contact',
          },
        ],
      },
    ],
  },
];

export default SidebarContent;
