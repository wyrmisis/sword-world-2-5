/**
 * @file A component used for displaying weapons on a character sheet's equipment page.
 */

import { component } from '../decorators';
import BaseComponent from '../base-component';
// @ts-expect-error - TS doesn't understand importing a CSS file
import styles from './sw-input.css' assert { type: "css" };

/**
 * @ignore - Until Foundry supports custom element input fields
 */
@component('sw-input')
export default class SwInput extends BaseComponent {
  static formAssociated: boolean = true;

  static get styles(): CSSStyleSheet[] {
    return [styles];
  }

  async connectedCallback(): Promise<void> {
    await super.connectedCallback();

    this.toggleAttribute('no-label', this.#noLabel);
  }

  get template() {
    return /* html */ `
      <label id="label" class="${!this.#noLabel ? "" : "empty"}"><slot></slot></label>
      <input ${this.disabled ? 'disabled ' : ''
      }${this.readonly ? 'readonly ' : ''
      }type="text" data-dtype="${this.dataset.dtype || "String"}" aria-labeledby="label" value="${this.value}" />
    `;
  }

  protected events(): void {
    this.shadowRoot.querySelector('input')?.addEventListener('change', this.#onChange.bind(this))
  }

  #onChange(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
  }

  get #noLabel() {
    return !Array.from(this.childNodes).length;
  }

  get readonly() {
    return this.hasAttribute("readonly");
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }
}
