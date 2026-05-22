
import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DataItem } from './types.js';

@customElement('quantum-grid-column')
export class QuantumGridColumn extends LitElement {
  @property({ type: String }) key: keyof DataItem = '' as any;
  @property({ type: String, attribute: 'column-key' }) columnKey?: string;
  @property({ type: String }) name?: string;
  @property({ type: String }) label = '';
  @property({ type: String }) title = ''; // Alias for label
  @property({ type: Boolean }) hidden = false;
  @property({ type: Number }) width = 150;
  @property({ type: String }) align: 'left' | 'center' | 'right' = 'left';
  @property({ type: String, attribute: 'agg-type' }) aggType?: 'sum' | 'avg' | 'count';
  @property({ type: String, attribute: 'data-type' }) dataType?: string;

  override connectedCallback() {
    super.connectedCallback();
    this._notifyParent();
  }

  override updated(changedProperties: any) {
    super.updated(changedProperties);
    this._notifyParent();
  }

  override disconnectedCallback() {
    this._notifyParent();
    super.disconnectedCallback();
  }

  private _notifyParent() {
    const parent = this.closest('quantum-grid') as any;
    if (parent && typeof parent._syncColumnsFromTags === 'function') {
      parent._syncColumnsFromTags();
    }
  }

  // This component doesn't render anything visible
  override createRenderRoot() {
    return this;
  }

  override render() {
    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'quantum-grid-column': QuantumGridColumn;
  }
}

