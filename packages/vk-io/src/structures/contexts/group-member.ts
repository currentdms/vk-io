import { Context, IContextOptions } from './context';

import { copyParams } from '../../utils/helpers';
import { inspectCustomData } from '../../utils/constants';

const subTypes: Record<string, string> = {
	group_leave: 'leave_group_member',
	group_join: 'join_group_member'
};

export interface IGroupMemberContextPayload {
	user_id: number;
	self?: number;
	join_type?: string;
}

export type GroupMemberContextOptions<S> =
	Omit<IContextOptions<IGroupMemberContextPayload, S>, 'type' | 'subTypes'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GroupMemberContext<S = Record<string, any>>
	extends Context<IGroupMemberContextPayload, S> {
	public constructor(options: GroupMemberContextOptions<S>) {
		super({
			...options,

			type: 'group_member',
			subTypes: [
				subTypes[options.updateType]
			]
		});
	}

	/**
	 * Checks is join user
	 */
	public get isJoin(): boolean {
		return this.subTypes.includes('join_group_member');
	}

	/**
	 * Checks is leave user
	 */
	public get isLeave(): boolean {
		return this.subTypes.includes('leave_group_member');
	}

	/**
	 * Checks is self leave user
	 */
	public get isSelfLeave(): boolean | undefined {
		if (this.isJoin) {
			return undefined;
		}

		return Boolean(this.payload.self);
	}

	/**
	 * Returns the identifier user
	 */
	public get userId(): number {
		return this.payload.user_id;
	}

	/**
	 * Returns the join type
	 */
	public get joinType(): string | undefined {
		if (this.isLeave) {
			return undefined;
		}

		return this.payload.join_type!;
	}

	/**
	 * Returns the custom data
	 */
	public [inspectCustomData](): object {
		return copyParams(this, [
			'userId',
			'joinType',
			'isJoin',
			'isLeave',
			'isSelfLeave'
		]);
	}
}
