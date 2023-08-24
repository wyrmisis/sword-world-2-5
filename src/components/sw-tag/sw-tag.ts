/**
 * @file A component used for displaying weapons on a character sheet's equipment page.
 */

import { component } from '../decorators';
import BaseComponent from '../base-component';
// @ts-expect-error - TS doesn't understand importing a CSS file
import styles from './sw-tag.css' assert { type: "css" };

@component('sw-tag')
export default class SwTag extends BaseComponent {
  static get styles(): CSSStyleSheet[] {
    return [styles];
  }

  get template() {
    return /* html */ `
    <slot></slot>
    `;
  }
}