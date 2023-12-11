/**
 * @file A component used for displaying weapons on a character sheet's equipment page.
 */

import { component } from '../decorators';
import BaseComponent from '../base-component';
// @ts-expect-error - TS doesn't understand importing a CSS file
import styles from './sw-select.css' assert { type: "css" };

/**
 * @ignore - Until Foundry supports custom element input fields
 */
@component('sw-select')
export default class SwSelect extends BaseComponent {
  static formAssociated: boolean = true;

  static get styles(): CSSStyleSheet[] {
    return [styles];
  }

  get template() {
    return /* html */ `
      <label id="label"><slot name="label"></slot></label>
      <select aria-labeledby="label" value="${this.value}" ${this.disabled ? 'disabled ' : ''
      }${this.readonly ? 'readonly ' : ''
      }>
        <slot></slot>
      </select>
    `;
  }

  protected events(): void {
    this.shadowRoot.querySelector('select')?.addEventListener('change', this.#onChange.bind(this));
    this.#setUpOptionObserver();
  }

  protected async prepareData(): Promise<void> {

  }

  observeOptions() {
    if (this.selectElement?.childElementCount) {
      this.selectElement.innerHTML = '';
    }
    Array.from(this.childNodes).forEach(node => {
      if (node.nodeName.toLowerCase() === 'option')
        this.selectElement?.appendChild(node.cloneNode(true));
    });
  }

  get selectElement() {
    return this.shadowRoot.querySelector('select') as HTMLSelectElement | null;
  }

  #onChange(e: Event) {
    this.value = (e.target as HTMLSelectElement).value;
  }

  #setUpOptionObserver() {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type == 'childList') {
          this.observeOptions();
        }
      });
    });
    observer.observe(this, { childList: true, subtree: true });
    this.observeOptions();
  }

  get readonly() {
    return this.hasAttribute("readonly");
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }
}
