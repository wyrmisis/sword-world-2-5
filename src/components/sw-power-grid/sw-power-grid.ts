/**
 * @file A component used for displaying weapons on a character sheet's equipment page.
 */

import { component } from '../decorators';
import BaseComponent from '../base-component';
import powerMap from '../../data/power';
// @ts-expect-error - TS doesn't understand importing a CSS file
import styles from './sw-power-grid.css' assert { type: "css" };

/**
 * Given a power value and critical value, display a table of power roll results.
 * 
 * @attribute value    - The Power value to show a table for. This attribute is required;
 *                        if there's no power value, we don't render the table.
 * @attribute critical - The lower bound for a critical with this weapon.
 */
@component('sw-power-grid')
export default class SwPowerGrid extends BaseComponent {
  static get styles(): CSSStyleSheet[] {
    return [styles];
  }

  get template() {
    if (!this.#map) return '';

    return /* html */ `
      ${this.#labels}
      ${[...this.#map.entries()].map(
        ([diceValue, powerValue]) =>
          this.#buildPowerEntry(diceValue as number, powerValue as number)
      ).join('')}
    `;
  }

  get #critical() {
    if (!this.hasAttribute("critical"))
      return 12;

    const value = parseInt(this.getAttribute("critical") || '12');

    return (isNaN(value)) ? 12 : value;
  }

  get #map() {
    if (!this.hasAttribute("value"))
      return null;

    const level = parseInt(this.getAttribute("value") || '0');

    if (isNaN(level))
      return null;

    return powerMap.get(level)
  }

  get #labels() {
    const diceResultTitle = SwPowerGrid.localize("SWComponent.PowerGrid.diceResult");
    const valueTitle = SwPowerGrid.localize("SWComponent.PowerGrid.value");

    return /* html */ `
      <span class="set">
        <span class="dice-result" title="${diceResultTitle}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
        </span>
        <span class="value" title="${valueTitle}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
        </span>
      </span>
    `;
  }

  #buildPowerEntry(diceValue: number, powerValue: number) {
    const isAutoFail = powerValue === null;
    const isCritical = diceValue >= this.#critical;

    let setClass = 'set';

    if (isCritical) setClass += ' critical';
    if (isAutoFail) setClass += ' fail';

    return /* html */ `
      <span class="${setClass}">
        <span class="dice-result">${diceValue}</span>
        <span class="value">${!isAutoFail ? powerValue : '--'}</span>
      </span>
    `;
  }
}