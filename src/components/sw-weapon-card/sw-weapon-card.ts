/**
 * @file A component used for displaying weapons on a character sheet's equipment page.
 */

import { component } from '../decorators';
import BaseComponent from '../base-component';
// @ts-expect-error - TS doesn't understand importing a CSS file

import styles from './sw-weapon-card.css' assert { type: "css" };

import { dom, icon } from "@fortawesome/fontawesome-svg-core";
import { faEye, faScroll, faTrash } from '@fortawesome/free-solid-svg-icons';
import SwSelect from '../sw-select/sw-select';

@component('sw-weapon-card')
export default class SwWeaponCard extends BaseComponent {
  item?: Item;

  /**
   * @todo Implement!
   */
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
    const iconStyles = new CSSStyleSheet();
    iconStyles.replaceSync(dom.css());
    return [styles, iconStyles];
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

    const stanceList = stances.length
      ? /* html */ `
        <ul class="stances">
          ${stances.map(this.#stanceTemplate).join("")}
        </ul>
      `
      : /* html */ `
        <p class="empty">${SwWeaponCard.localize('SW.equipment.weapons.empty')}</p>
      ` 

    const rankTag = this.#toTag(
      SwWeaponCard.format("SW.equipment.general.gearRank.ofRank", {
        // @ts-expect-error - Item.system exists
        rank: SwWeaponCard.localize(`SW.equipment.general.gearRank.${this.item?.system.rank}`)
      }),
      true
    );

    // @ts-expect-error - Item.system exists
    const categoryTags = this.item.system.weaponCategories.map((category: string) =>
        SwWeaponCard.localize(`SW.equipment.weapon.weaponCategory.${category}`)
      )
      .map((category: string) => this.#toTag(category, true))
      .join('');

    return /* html */ `
    <slot></slot>
    <sw-card>
      <img slot="icon" src="${this.item.img}" />
    
      <span slot="title">${this.item.name}</span>

      ${rankTag}
      ${categoryTags}
      
      <sw-select slot="controls" class="class-selector">
        <span slot="label">As...</span>
        ${this.#attackingClassList.map( (cls: Item) => /* html */ `
          <option value="${cls.id}"${cls.id !== this.item.system.attackingClassId ? '' : ' selected'}>${cls.name}</option>
        `).join('')}
      </sw-select>
      
      ${this.#controls}

      <div slot="supplemental-content">${stanceList}</div>

      <div slot="description" class="description">${description}</div>
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
    this.shadowRoot.querySelector('.class-selector')
      ?.addEventListener('change', this.#setAttackingClass.bind(this));

    // @todo How can I get this repositioned to start from the header?
    // this.contextMenu = new ContextMenu(
    //   $(this),
    //   this.localName,
    //   this.contextMenuSettings
    // )
  }

  get #attackingClassList() {
    // @ts-expect-error - FVTT types not updated to account for Document.system
    return this.item?.system?.attackingClassOptions || []
  }

  #setAttackingClass(e: Event) {
    e.stopPropagation();

    const { value } = e.target as SwSelect;

    if (!value) return;

    this.item?.update({
      'system.attackingClassId': value
    })
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

  get #controls() {
    return /* html */ `
    <div slot="controls" class="controls">
      <button
        type="button"
        class="share"
        aria-label="${SwWeaponCard.localize("SWComponent.WeaponCard.share")}"
        title="${SwWeaponCard.localize("SWComponent.WeaponCard.share")}">
        ${icon(faEye).html}
      </button>
      <button
        type="button"
        class="edit"
        aria-label="${SwWeaponCard.localize("SWComponent.WeaponCard.edit")}"
        title="${SwWeaponCard.localize("SWComponent.WeaponCard.edit")}">
        ${icon(faScroll).html}
      </button>
      <button
        type="button"
        class="delete"
        aria-label="${SwWeaponCard.localize("SWComponent.WeaponCard.delete")}"
        title="${SwWeaponCard.localize("SWComponent.WeaponCard.delete")}">
        ${icon(faTrash).html}
      </button>
    </div>
    `
  }

  /**
   * @todo Proper typing for the stance argument
   * @todo Can damage modifier ever be negative?
   * @param s - The stance to use for this row
   * @returns 
   */
  #stanceTemplate = (s: any) => {
    const stanceName = SwWeaponCard.localize(`SW.equipment.weapon.stanceType.${s.stanceType}`)
    const damageModifier = SwWeaponCard.format('SW.equipment.weapon.plusDamage', {
      amount: s.modifiers?.extraDamage
    })
    
    return /* html */ `
      <li class="stance">
        <span class="stance-name">${stanceName}</span>
        <span class="stance-tags">
          <sw-tag>Tag One</sw-tag>
          <sw-tag>Tag Two</sw-tag>
          <sw-tag>Tag Three</sw-tag>
          <sw-tag>Tag Four</sw-tag>
        </span>
        <span class="min-strength">${s.minimumStrength}</span>
        <span class="accuracy">${s.modifiers.accuracy}</span>
        <span class="power">
          <span class="power-value">${s.power}</span>
          ${s.extraDamage ? `<span class="extra-damage">${damageModifier}</span>` : ``}
        </span>
      </li>
      `
  }

  #toTag(content: string, asSlot: boolean) {
    return /* html */`
      <sw-tag ${asSlot ? 'slot="tags"' : ''}>${content}</sw-tag>
    `;
  }
}