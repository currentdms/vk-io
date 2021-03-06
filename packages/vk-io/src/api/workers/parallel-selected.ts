import { APIRequest } from '../request';
import { sequential } from './sequential';

import { API } from '../api';
import {
	delay,
	getChainReturn,
	resolveExecuteTask
} from '../../utils/helpers';

export async function parallelSelected(api: API, next: Function): Promise<void> {
	// @ts-ignore
	const { apiExecuteMethods, apiExecuteCount } = api.vk.options;

	// @ts-ignore
	const { queue } = api;

	if (!apiExecuteMethods.includes(queue[0].method)) {
		sequential(api, next);

		return;
	}

	// Wait next event loop, saves one request or more
	await delay(0);

	const tasks: APIRequest[] = [];
	const chain: string[] = [];

	for (let i = 0; i < queue.length; i += 1) {
		if (!apiExecuteMethods.includes(queue[i].method)) {
			continue;
		}

		const [request] = queue.splice(i, 1);

		i -= 1;

		tasks.push(request);
		chain.push(String(request));

		if (tasks.length >= apiExecuteCount) {
			break;
		}
	}

	if (tasks.length === 0) {
		sequential(api, next);

		return;
	}

	try {
		const request = new APIRequest({
			method: 'execute',
			params: {
				code: getChainReturn(chain)
			}
		});

		// @ts-ignore
		api.callMethod(request);

		next();

		resolveExecuteTask(tasks, await request.promise);
	} catch (error) {
		for (const task of tasks) {
			task.reject(error);
		}
	}
}
