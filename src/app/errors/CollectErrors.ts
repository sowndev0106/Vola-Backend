
export interface ICollectErrors {
	[key: string]: string;
}

export default class CollectErrors {
	private _errors: ICollectErrors;

	public constructor() {
		this._errors = {};
	}

	public get errors() {
		return this._errors;
	}

	public collect(tag: string, method: Function): any {
		try {
			return method();
		} catch (error:any) {
			this._errors[tag] = error.message;
		}
	}

	public async collectAsync(tag: string, method: Function): Promise<any> {
		try {
			return await method();
		} catch (error:any) {
			this._errors[tag] = error.message;
		}
	}

	public clear() {
		this._errors = {};
	}

	public hasError() {
		return Object.keys(this._errors).length > 0;
	}
}
