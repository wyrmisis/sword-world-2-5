/**
 * @file A component used for displaying armor on a character sheet's equipment page.
 */

import { component } from '../decorators';
import BaseComponent from '../base-component';
// @ts-expect-error - TS doesn't understand importing a CSS file
import styles from './sw-armor-card.css' assert { type: "css" };

@component('sw-armor-card')
export default class SwArmorCard extends BaseComponent {
  item?: Item;

  static get styles(): CSSStyleSheet[] {
    return [styles];
  }

  protected async prepareData() {
    if (this.hasAttribute('uuid'))
      this.item = await fromUuid(this.getAttribute('uuid') as string) as Item; 
  }

  get template() {
    return /* html */ `
      <header>
        <img src="https://placekitten.com/32/32" />
        <div class="armor-info">
          <span class="armor-name">Armor name</span>
          <span class="tag">Tag One</span>
          <span class="tag">Tag Two</span>
          <span class="tag">Tag Three</span>
          <span class="tag">Tag Four</span>
        </div>
        <div class="controls">
          <button class="delete">Share to chat</button>
          <button class="delete">Edit</button>
          <button class="delete">Delete</button>
        </div>
      </header>
      <main>
        <span class="stance-name"></span>
        <span class="stance-tags">
          <span class="tag">Tag One</span>
          <span class="tag">Tag Two</span>
          <span class="tag">Tag Three</span>
          <span class="tag">Tag Four</span>
        </span>
        <span class="min-strength">15</span>
        <span class="type">Non-Metallic</span>
        <span class="evasion">-1</span>
        <span class="defense">5</span>
      </main>
      <aside>
        <p>Some descriptive text</p>
      </aside>
    `;
  }
}