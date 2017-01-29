import { either, isEmpty } from 'rambda';

const isUndefined = (...xs) => xs.some(el => typeof el === 'undefined');
const isFilledObject = either(isUndefined, isEmpty);
const isHighlightedEl = el => el.highlighting;
const isInt = n => parseInt(n, 10) === parseFloat(n);


export default {
  isUndefined,
  isFilledObject,
  isHighlightedEl,
  isInt,
};
