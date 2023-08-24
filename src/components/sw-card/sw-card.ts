/**
 * @file A component used for displaying weapons on a character sheet's equipment page.
 */

import { component } from '../decorators';
import BaseComponent from '../base-component';
// @ts-expect-error - TS doesn't understand importing a CSS file
import styles from './sw-card.css' assert { type: "css" };

@component('sw-card')
export default class SwCard extends BaseComponent {
  static get styles(): CSSStyleSheet[] {
    return [styles];
  }

  /**
   * @todo Don't show tags if there are no tags
   * @todo Don't show icon if there is no icon
   * @todo Don't show controls if there are no controls
   * @todo Don't show supplemental content if there is no content
   * @todo Don't show description if there is no description
   */
  get template() {
    return /* html */ `
    <header>
      <slot name="icon"></slot>
      <div class="title">
        <span class="name">
          <slot name="title"></slot>
        </span>
        <span class="tags">
          <slot name="tags"></slot>
        </span>
      </div>
      <div class="controls">
        <slot name="controls"></slot>
      </div>
    </header>
    <div>
      <slot name="supplemental-content"></slot>
    </div>
    <main>
      <slot name="description"></slot>
    </main>
    `;
  }
}