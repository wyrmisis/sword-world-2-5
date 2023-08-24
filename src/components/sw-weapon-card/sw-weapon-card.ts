/**
 * @file A component used for displaying weapons on a character sheet's equipment page.
 */

import { component } from '../decorators';
import BaseComponent from '../base-component';
// @ts-expect-error - TS doesn't understand importing a CSS file
import styles from './sw-weapon-card.css' assert { type: "css" };

@component('sw-weapon-card')
export default class SwWeaponCard extends BaseComponent {
  item?: Item;

  get contextMenuSettings() {
    return [{ 
      name: 'Share in Chat',
      icon: '<i class="fa fa-eye"></i>', 
      callback: () => {
        this.#onShare();
      }
    },
    { 
      name: 'Edit',
      icon: '<i class="fa fa-edit"></i>',
      callback: () => {
        this.#onEdit();
      }
    },
    {
      name: 'Delete',
      icon: '<i class="fa fa-trash"></i>', 
      condition: () => {
        return !!this.item?.isOwner;
      },
      callback: () => {
        this.#onDelete();
      }
    }];
  }

  contextMenu?: unknown;

  static get styles(): CSSStyleSheet[] {
    return [styles];
  }

  protected async prepareData() {
    if (this.hasAttribute('uuid'))
      this.item = await fromUuid(this.getAttribute('uuid') as string) as Item; 
  }

  /**
   * @todo Icons for the buttons
   */
  get template() {
    if (!this.item) return '';

    // @ts-expect-error - FVTT types not updated to account for Document.system
    const { stances, description } = this.item.system;

    /**
     * @todo Proper typing for the stance argument
     * @param s - The stance to use for this row
     * @returns 
     */
    const stanceTemplate = (s: any) => /* html */ `
    <li class="stance">
      <span class="stance-name">1H</span>
      <span class="stance-tags">
        <sw-tag>Tag One</sw-tag>
        <sw-tag>Tag Two</sw-tag>
        <sw-tag>Tag Three</sw-tag>
        <sw-tag>Tag Four</sw-tag>
      </span>
      <span class="min-strength">${s.minStrength}</span>
      <span class="accuracy">${s.accuracy}</span>
      <span class="power">
        <span class="power-value">${s.power}</span>
        <span class="extra-damage">${s.extraDamage}</span>
      </span>
    </li>
    `

    const stanceList = stances.length
      ? /* html */ `
        <ul class="stances">
          ${stanceTemplate(stances)}
        </ul>
      `
      : /* html */ /* @ts-expect-error - game.i18n exists */`
        <p class="empty">${game.i18n.localize('SW.equipment.weapons.empty')}</p>
      ` 

    return /* html */ `
    <slot></slot>
    <sw-card>
      <img slot="icon" src="${this.item.img}" />
    
      <span slot="title">${this.item.name}</span>
      
      <sw-tag slot="tags">Tag One</sw-tag>
      <sw-tag slot="tags">Tag Two</sw-tag>
      <sw-tag slot="tags">Tag Three</sw-tag>
      <sw-tag slot="tags">Tag Four</sw-tag>

      <div slot="controls">
        <label>As...</label>
        <select class="">
          <option>Test Option</option>
        </select>
      </div>
      
      <div slot="controls" class="controls">
        <button type="button" class="share">Share to chat</button>
        <button type="button" class="edit">Edit</button>
        <button type="button" class="delete">Delete</button>
      </div>

      <div slot="supplemental-content">${stanceList}</div>

      <div slot="description">${description}</div>
    </sw-card>
    `;
  }

  protected events() {
    this.shadowRoot.querySelector('.share')
      ?.addEventListener('click', this.#onShare.bind(this));
    this.shadowRoot.querySelector('.edit')
      ?.addEventListener('click', this.#onEdit.bind(this));
    this.shadowRoot.querySelector('.delete')
      ?.addEventListener('click', this.#onDelete.bind(this));

    // @todo How can I get this repositioned to start from the header?
    // this.contextMenu = new ContextMenu(
    //   $(this),
    //   this.localName,
    //   this.contextMenuSettings
    // )
  }

  /**
   * @todo Share to chat functionality
   * @param e - The click event that triggered this event
   */
  #onShare(e?: Event) {
    e && e.stopPropagation();
  }

  #onEdit(e?: Event) {
    e && e.stopPropagation();
    this.item?.sheet?.render(true);
  }

  #onDelete(e?: Event) {
    e && e.stopPropagation();
    this.item?.deleteDialog();
  }
}