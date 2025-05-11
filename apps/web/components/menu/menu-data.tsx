export interface NavItemType {
  Icon?: any;
  label: string;
  value?: string;
  checkFunction?: (params: any) => boolean;
  iconUrl?: string;
  actionCode?: string;
}
const checkPath = ({ pathname, value }: { pathname: string; value: string }) =>
  pathname.includes(value);

export const getNavItems = (): NavItemType[] => [
  {
    label: 'Today',
    value: '/today',
    checkFunction: checkPath,
  },
  {
    label: 'All Days',
    value: '/hcmc',
    checkFunction: checkPath,
  },
];

// export const getNumOfGuest = (): NavItemType[] => ({
//   label: 'Num of Guest',
//   route: '/num-of-guest',
//   checkFunction: checkPath,
// });
