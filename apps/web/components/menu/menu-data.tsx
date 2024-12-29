export interface NavItemType {
  Icon?: any;
  label: string;
  route?: string;
  disabled?: boolean;
  checkFunction?: (params: any) => boolean;
  iconUrl?: string;
}
const checkPath = ({ pathname, route }: { pathname: string; route: string }) =>
  pathname.includes(route);

export const getNavItems = (): NavItemType[] => [
  {
    label: 'Today',
    route: '/today',
    checkFunction: checkPath,
  },
  {
    label: 'All Days',
    route: '/hcmc',
    checkFunction: checkPath,
  },
];

// export const getNumOfGuest = (): NavItemType[] => ({
//   label: 'Num of Guest',
//   route: '/num-of-guest',
//   checkFunction: checkPath,
// });
