import { VK } from '../../vk';

import { ExternalAttachment } from './external';

import { PhotoAttachment, IPhotoAttachmentPayload } from './photo';
import { copyParams } from '../../utils/helpers';
import { AttachmentType, inspectCustomData } from '../../utils/constants';

const { LINK } = AttachmentType;

const kPhoto = Symbol('kPhoto');

export interface ILinkAttachmentPayload {
	title: string;
	caption?: string;
	description?: string;
	url: string;
	product?: {
		price: object;
	};
	button?: {
		title: string;
		action: {
			type: string;
			url: string;
		};
	};
	photo?: IPhotoAttachmentPayload;
}

export class LinkAttachment extends ExternalAttachment<ILinkAttachmentPayload> {
	protected [kPhoto]?: PhotoAttachment;

	/**
	 * Constructor
	 */
	public constructor(payload: ILinkAttachmentPayload, vk?: VK) {
		super(LINK, payload);

		// @ts-ignore
		this.vk = vk;
	}

	/**
	 * Checks for the presence of a photo in a link
	 */
	public get hasPhoto(): boolean {
		return Boolean(this[kPhoto]);
	}

	/**
	 * Returns the title
	 */
	public get title(): string {
		return this.payload.title;
	}

	/**
	 * Returns the title
	 */
	public get caption(): string | undefined {
		return this.payload.caption;
	}

	/**
	 * Returns the description
	 */
	public get description(): string | undefined {
		return this.payload.description;
	}

	/**
	 * Returns the URL of the link
	 */
	public get url(): string {
		return this.payload.url;
	}

	/**
	 * Returns the product
	 */
	public get product(): {
		price: object;
	} | undefined {
		return this.payload.product;
	}

	/**
	 * Returns the button
	 */
	public get button(): {
		title: string;
		action: {
			type: string;
			url: string;
		};
	} | undefined {
		return this.payload.button;
	}

	/**
	 * Returns the photo
	 */
	public get photo(): PhotoAttachment | undefined {
		if (!this[kPhoto]) {
			this[kPhoto] = this.payload.photo
				? new PhotoAttachment(this.payload.photo, this.vk)
				: undefined;
		}

		return this[kPhoto];
	}

	/**
	 * Returns the custom data
	 */
	public [inspectCustomData](): object {
		return copyParams(this, [
			'title',
			'caption',
			'description',
			'url',
			'product',
			'button',
			'photo'
		]);
	}
}
