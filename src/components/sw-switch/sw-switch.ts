/**
 * @file A component used for toggling between boolean values.
 */

import { component } from '../decorators';
import BaseComponent from '../base-component';
// @ts-expect-error - TS doesn't understand importing a CSS file
import styles from './sw-switch.css' assert { type: "css" };

/**  
 * @ignore - Until Foundry supports custom element input fields
 */
@component('sw-switch')
export default class SwSwitch extends BaseComponent {
  get value() { return this.checked.toString() }
  set value(_value) { /* noop */ }

  type = "checkbox";

  static get styles(): CSSStyleSheet[] {
    return [styles];
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();

    // Necessary for properly setting data to a boolean type in Foundry 
    this.setAttribute("data-dtype", "Boolean");
  }

  get template() {
    return /* html */ `
    <input type="checkbox" ${this.checked ? 'checked' : ''} />
    <span class="label label--on"><slot name="on">${SwSwitch.localize("SWComponent.Switch.on")}</slot></span>
    <span class="label label--off"><slot name="off">${SwSwitch.localize("SWComponent.Switch.off")}</slot></span>
    `;
  }

  get #checkbox() {
    return this.shadowRoot.querySelector('[type="checkbox"]') as HTMLInputElement;
  }

  get checked() {
    return this.#checkbox?.checked;
  }

  set checked(checked) {
    this.#checkbox.checked = checked;
    this.toggleAttribute('checked', checked);
    this.dispatchEvent(new Event("change", { bubbles: true }))
  }

  events() {
    this.addEventListener("click", this.#onClick.bind(this));
  }

  #onClick(e: Event) {
    e.stopPropagation();
    this.checked = !this.checked;
  }
}
