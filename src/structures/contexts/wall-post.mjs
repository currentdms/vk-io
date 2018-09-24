import Context from './context';

import { WallAttachment } from '../attachments';

const subTypes = {
	wall_post_new: 'new_wall_post',
	wall_repost: 'new_wall_repost'
};

export default class WallPostContext extends Context {
	/**
	 * constructor
	 *
	 * @param {VK}     vk
	 * @param {Object} payload
	 * @param {Object} options
	 */
	constructor(vk, payload, { updateType, groupId }) {
		super(vk);

		this.payload = payload;
		this.$groupId = groupId;

		this.attachments = [new WallAttachment(payload, vk)];

		this.type = 'wall_post';
		this.subTypes = [
			subTypes[updateType]
		];
	}

	/**
	 * Checks is repost
	 *
	 * @return {boolean}
	 */
	get isRepost() {
		return this.subTypes.includes('new_wall_repost');
	}

	/**
	 * Returns the wall attachment
	 *
	 * @return {WallAttachment}
	 */
	get wall() {
		return this.attachments[0];
	}

	/**
	 * Removes a record from the wall
	 *
	 * @return {Promise}
	 */
	deletePost() {
		const { wall } = this;

		return this.vk.api.wall.delete({
			post_id: wall.id,
			owner_id: wall.ownerId
		});
	}
}
