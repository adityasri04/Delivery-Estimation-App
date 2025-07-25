import { atom } from 'recoil';

export const addressState = atom({
  key: 'addressState',
  default: '',
});

export const deliveryEstimateState = atom({
  key: 'deliveryEstimateState',
  default: null,
});
