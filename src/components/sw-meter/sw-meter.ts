/**
 * @file A component used for displaying weapons on a character sheet's equipment page.
 */

import { component } from '../decorators';
import BaseComponent from '../base-component';
// @ts-expect-error - TS doesn't understand importing a CSS file
import styles from './sw-meter.css' assert { type: "css" };

@component('sw-meter')
export default class SwMeter extends BaseComponent {
  static get styles(): CSSStyleSheet[] {
    return [styles];
  }

  protected async prepareData(): Promise<void> {
    this.setAttribute("data-dtype", "Number");
  }

  get max() {
    return this.getAttribute("max");
  }

  protected events(): void {
    this.shadowRoot.querySelector('.value')
      ?.addEventListener('change', this.#onChange.bind(this));
  }

  #onChange(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
  }

  get template() {
    return /* html */ `
      <sw-input class="value" type="text" data-dtype="Number" value="${this.value}"><slot></slot></sw-input>
      <span class="divider">/</span>
      <sw-input readonly data-dtype="Number" value="${this.max}"></sw-input>
      <progress value="${this.value}" max="${this.max}" />
    `;
  }
}